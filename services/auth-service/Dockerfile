# -------------------------------------------------------------
# SHUBHANU Auth Microservice Dockerfile
# Production-ready multi-stage alpine build
# -------------------------------------------------------------

FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency configs
COPY package*.json ./
COPY tsconfig.json ./

# Install development dependencies
RUN npm ci

# Copy database schema models & compile client typings
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source scripts
COPY src ./src/

# Compile TypeScript to ESNext javascript in /dist
RUN npm run build

# Clean development packages
RUN npm prune --production

# -------------------------------------------------------------
# Runner stage (keeps final container image size minimal)
# -------------------------------------------------------------
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Copy compiled resources and system engines from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "dist/server.js"]
