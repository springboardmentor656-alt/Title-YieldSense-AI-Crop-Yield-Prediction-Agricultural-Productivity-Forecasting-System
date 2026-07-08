import time
import logging

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


logger = logging.getLogger("yieldsense")


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()

        logger.info(
            f"Incoming Request | "
            f"{request.method} {request.url.path} | "
            f"Client: {request.client.host if request.client else 'Unknown'}"
        )

        try:
            response = await call_next(request)

            process_time = (time.perf_counter() - start_time) * 1000

            logger.info(
                f"Completed | "
                f"{request.method} {request.url.path} | "
                f"Status: {response.status_code} | "
                f"Time: {process_time:.2f} ms"
            )

            response.headers["X-Process-Time"] = f"{process_time:.2f} ms"

            return response

        except Exception as e:
            process_time = (time.perf_counter() - start_time) * 1000

            logger.exception(
                f"Request Failed | "
                f"{request.method} {request.url.path} | "
                f"Time: {process_time:.2f} ms | "
                f"Error: {str(e)}"
            )

            raise