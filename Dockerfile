# ---------- Base ----------

FROM node:17-alpine AS base

WORKDIR /app

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - dist: A production build compiled with Babel
FROM base AS builder

COPY package*.json tsconfig.json ./

RUN npm install

COPY ./src ./src

RUN npm run build

RUN npm prune --production

# ---------- Release ----------
FROM base AS release
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node

CMD ["node", "dist/server.js"]