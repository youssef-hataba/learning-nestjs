# ==========================================
# 1. Dependencies Stage
# ==========================================
FROM node:24-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# ==========================================
# 2. Build Stage
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ==========================================
# 3. Production Runner Stage
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built code from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory for persistent storage
RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["node", "dist/main.js"]
