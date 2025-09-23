# Use Node.js 20 LTS as base image
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Create data directory for SQLite database
RUN mkdir -p data

# Expose port (if needed for health checks)
EXPOSE 3001

# Start the application
CMD ["pnpm", "run", "start"]