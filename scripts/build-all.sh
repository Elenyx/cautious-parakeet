#!/bin/bash

# Build and Push All Services Script
# Usage: ./scripts/build-all.sh [version] [--push]
# Example: ./scripts/build-all.sh 1.0.0 --push

set -e

VERSION=$1
PUSH_FLAG=$2

# Default version
DEFAULT_VERSION="latest"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Validate inputs
if [ -z "$VERSION" ]; then
    VERSION=$DEFAULT_VERSION
    print_warning "No version specified, using: $VERSION"
fi

print_status "Building all services with version: $VERSION"

# Build bot service
print_status "Building bot service..."
./scripts/docker-build.sh bot "$VERSION" $PUSH_FLAG

# Build client service
print_status "Building client service..."
./scripts/docker-build.sh client "$VERSION" $PUSH_FLAG

print_success "All services built successfully!"
print_status "Services available:"
print_status "  - elenyx/ticketmesh-bot:$VERSION"
print_status "  - elenyx/ticketmesh-client:$VERSION"

if [ "$PUSH_FLAG" = "--push" ]; then
    print_success "All images pushed to Docker Hub!"
else
    print_warning "Images built locally. Use --push flag to push to registry."
fi
