"""In-memory sliding-window rate limiter middleware for YieldSense AI.

Keys requests by client IP (`request.client.host`) and rejects requests
that exceed `limit` requests within a rolling `window_seconds` window
with a 429 JSON response.

Caveat: state is process-local (a plain dict in memory). This is correct
for a single backend container/process. If the backend is ever scaled to
multiple replicas without sticky sessions, each replica enforces its own
independent limit — a shared store (e.g. Redis) would be required for a
global limit across replicas. That is out of scope for this local setup.
"""

import time
import logging
from collections import deque
from typing import Deque, Dict

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


logger = logging.getLogger("yieldsense")


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """Sliding-window rate limiter, keyed by client IP.

    Args:
        app: the ASGI app being wrapped.
        limit: maximum number of requests allowed per `window_seconds`.
        window_seconds: length of the rolling window, in seconds.
    """

    def __init__(self, app, limit: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.limit = limit
        self.window_seconds = window_seconds
        # client_ip -> deque of request timestamps (monotonic seconds)
        self._requests: Dict[str, Deque[float]] = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.monotonic()

        timestamps = self._requests.setdefault(client_ip, deque())

        # Drop timestamps that have fallen outside the rolling window.
        cutoff = now - self.window_seconds
        while timestamps and timestamps[0] < cutoff:
            timestamps.popleft()

        if len(timestamps) >= self.limit:
            retry_after = max(0, int(self.window_seconds - (now - timestamps[0])))

            logger.warning(
                f"Rate limit exceeded | Client: {client_ip} | "
                f"{len(timestamps)} requests in last {self.window_seconds}s"
            )

            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests. Please slow down and try again shortly.",
                    "limit": self.limit,
                    "window_seconds": self.window_seconds,
                    "retry_after_seconds": retry_after,
                },
                headers={"Retry-After": str(retry_after)},
            )

        timestamps.append(now)

        response = await call_next(request)

        remaining = max(0, self.limit - len(timestamps))
        response.headers["X-RateLimit-Limit"] = str(self.limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)

        return response
