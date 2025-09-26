# Docker Deployment Guide

This guide explains how to build, tag, and deploy TicketMesh services using Docker with semantic versioning.

## Prerequisites

1. **Docker installed** on your system
2. **Docker Hub account** (username: `elenyx`)
3. **Logged in to Docker Hub**: `docker login`

## Quick Start

### Build and Push All Services

```bash
# Build all services with version 1.0.0 and push to registry
./scripts/build-all.sh 1.0.0 --push

# Build all services locally (no push)
./scripts/build-all.sh 1.0.0
```

### Build Individual Services

```bash
# Build bot service
./scripts/docker-build.sh bot 1.0.0 --push

# Build client service  
./scripts/docker-build.sh client 1.0.0 --push
```

### PowerShell (Windows)

```powershell
# Build and push bot service
.\scripts\docker-build.ps1 -Service bot -Version 1.0.0 -Push

# Build and push client service
.\scripts\docker-build.ps1 -Service client -Version 1.0.0 -Push
```

## Image Naming Convention

- **Bot**: `elenyx/ticketmesh-bot:VERSION`
- **Client**: `elenyx/ticketmesh-client:VERSION`
- **Latest**: `elenyx/ticketmesh-bot:latest`, `elenyx/ticketmesh-client:latest`

## Deployment Options

### Option 1: Using Registry Images (Recommended for Teams)

```bash
# Deploy with specific version
VERSION=1.0.0 docker-compose -f docker-compose.prod.yml up -d

# Deploy with latest version
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Individual Service Deployment

```bash
# Deploy bot service
cd packages/bot
docker-compose up -d

# Deploy client service
cd packages/client  
docker-compose up -d
```

### Option 3: Local Development

```bash
# Start all services with hot reload
docker-compose -f docker-compose.dev.yml up -d
```

## Semantic Versioning

Use semantic versioning for your Docker tags:

- **Major**: `1.0.0` (breaking changes)
- **Minor**: `1.1.0` (new features, backward compatible)
- **Patch**: `1.0.1` (bug fixes)

### Version Examples

```bash
# Release version 1.0.0
./scripts/build-all.sh 1.0.0 --push

# Release patch 1.0.1
./scripts/build-all.sh 1.0.1 --push

# Release minor 1.1.0
./scripts/build-all.sh 1.1.0 --push
```

## Environment Variables

Create `.env` files in each service directory:

### Bot Service (`packages/bot/.env`)
```env
NODE_ENV=production
PORT=3001
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DATABASE_URL=your_database_connection_string
API_SECRET=your_api_secret_key
REDIS_URL=your_redis_connection_string
```

### Client Service (`packages/client/.env`)
```env
NODE_ENV=production
PORT=3000
API_SECRET=your_api_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DATABASE_URL=your_database_connection_string
REDIS_URL=your_redis_connection_string
```

## Health Checks

Both services include health check endpoints:

- **Bot**: `http://localhost:3001/health`
- **Client**: `http://localhost:3000/api/health`

## Troubleshooting

### Port Conflicts

If you get `EADDRINUSE` errors, check what's using the ports:

```bash
# Check port 3001 (bot)
netstat -ano | findstr :3001

# Check port 3000 (client)
netstat -ano | findstr :3000
```

### Docker Login Issues

```bash
# Login to Docker Hub
docker login

# Check login status
docker info | grep Username
```

### Build Failures

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t elenyx/ticketmesh-bot:latest ./packages/bot
```

## Team Workflow

1. **Development**: Use `docker-compose.dev.yml` for local development
2. **Testing**: Build and test locally with specific versions
3. **Release**: Build and push to registry with semantic version
4. **Deployment**: Deploy using registry images in production

## Registry URLs

- **Docker Hub**: https://hub.docker.com/u/elenyx
- **Bot Images**: https://hub.docker.com/r/elenyx/ticketmesh-bot
- **Client Images**: https://hub.docker.com/r/elenyx/ticketmesh-client
