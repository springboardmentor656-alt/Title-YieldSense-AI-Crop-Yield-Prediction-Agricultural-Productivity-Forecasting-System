# YieldSense AI frontend - Next.js 16
#
# next.config.ts does NOT set `output: "standalone"`, so `next build`
# produces the regular `.next/` build (not the trimmed standalone
# server bundle). Using a standalone multi-stage copy here would silently
# break (`.next/standalone` wouldn't exist), so this stays a single-stage
# image that installs full deps and runs `next start`, which is what the
# current package.json scripts actually support. If you want a smaller
# multi-stage image later, add `output: "standalone"` to next.config.ts
# first, then split this into a builder + runner stage.

FROM node:20-slim

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Install deps first so this layer is cached unless package*.json changes.
COPY package.json package-lock.json ./
RUN npm ci

# Application code and build.
COPY . .
RUN npm run build

# Run as non-root.
RUN groupadd --system appgroup \
    && useradd --system --create-home --gid appgroup appuser \
    && chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

CMD ["npm", "run", "start"]
