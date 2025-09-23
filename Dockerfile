# Use Node.js 20 LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/bot/package.json ./packages/bot/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/bot ./packages/bot

# Build the application
WORKDIR /app/packages/bot
RUN pnpm run build

# Create data directory for SQLite database
RUN mkdir -p data

# Expose port (Railway will set PORT environment variable)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Bot health check')" || exit 1

# Start the application
CMD ["pnpm", "run", "start"]