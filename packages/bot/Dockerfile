# Build stage
FROM node:20-alpine AS builder

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite-dev

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files (bot package.json and local lockfile)
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies only
RUN apk add --no-cache sqlite

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod=true

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create data directory for SQLite database
RUN mkdir -p data

# Expose port (if needed for health checks)
EXPOSE 3001

# Start the application
CMD ["pnpm", "run", "start"]