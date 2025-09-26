#!/bin/bash

# Docker Build and Push Script for TicketMesh
# Usage: ./scripts/docker-build.sh [bot|client] [version] [--push]
# Example: ./scripts/docker-build.sh bot 1.0.0 --push

set -e

SERVICE=$1
VERSION=$2
PUSH_FLAG=$3

# Default values
DEFAULT_VERSION="latest"
REGISTRY="elenyx"
PROJECT_NAME="ticketmesh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate inputs
if [ -z "$SERVICE" ]; then
    print_error "Service name is required (bot or client)"
    echo "Usage: $0 [bot|client] [version] [--push]"
    exit 1
fi

if [ "$SERVICE" != "bot" ] && [ "$SERVICE" != "client" ]; then
    print_error "Service must be 'bot' or 'client'"
    exit 1
fi

if [ -z "$VERSION" ]; then
    VERSION=$DEFAULT_VERSION
    print_warning "No version specified, using: $VERSION"
fi

# Set image names
IMAGE_NAME="$REGISTRY/$PROJECT_NAME-$SERVICE"
FULL_TAG="$IMAGE_NAME:$VERSION"
LATEST_TAG="$IMAGE_NAME:latest"

print_status "Building Docker image for $SERVICE service"
print_status "Image: $FULL_TAG"

# Build the image
if [ "$SERVICE" = "bot" ]; then
    BUILD_CONTEXT="./packages/bot"
    DOCKERFILE="Dockerfile"
elif [ "$SERVICE" = "client" ]; then
    BUILD_CONTEXT="./packages/client"
    DOCKERFILE="Dockerfile"
fi

print_status "Build context: $BUILD_CONTEXT"
print_status "Dockerfile: $DOCKERFILE"

# Build the image
docker build -t "$FULL_TAG" -f "$BUILD_CONTEXT/$DOCKERFILE" "$BUILD_CONTEXT"

print_success "Image built successfully: $FULL_TAG"

# Tag as latest if version is not 'latest'
if [ "$VERSION" != "latest" ]; then
    docker tag "$FULL_TAG" "$LATEST_TAG"
    print_success "Tagged as latest: $LATEST_TAG"
fi

# Push to registry if --push flag is provided
if [ "$PUSH_FLAG" = "--push" ]; then
    print_status "Pushing images to Docker Hub..."
    
    # Login check
    if ! docker info | grep -q "Username:"; then
        print_warning "Not logged in to Docker Hub. Please run: docker login"
        print_status "Attempting to push anyway..."
    fi
    
    # Push versioned tag
    docker push "$FULL_TAG"
    print_success "Pushed: $FULL_TAG"
    
    # Push latest tag if version is not 'latest'
    if [ "$VERSION" != "latest" ]; then
        docker push "$LATEST_TAG"
        print_success "Pushed: $LATEST_TAG"
    fi
    
    print_success "All images pushed successfully!"
else
    print_warning "Images built but not pushed. Use --push flag to push to registry."
    print_status "To push manually: docker push $FULL_TAG"
fi

print_success "Build completed for $SERVICE service (version: $VERSION)"
