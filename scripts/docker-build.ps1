# Docker Build and Push Script for TicketMesh (PowerShell)
# Usage: .\scripts\docker-build.ps1 [bot|client] [version] [--push]
# Example: .\scripts\docker-build.ps1 bot 1.0.0 --push

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("bot", "client")]
    [string]$Service,
    
    [Parameter(Mandatory=$false)]
    [string]$Version = "latest",
    
    [Parameter(Mandatory=$false)]
    [switch]$Push
)

# Configuration
$Registry = "elenyx"
$ProjectName = "ticketmesh"

# Set image names
$ImageName = "$Registry/$ProjectName-$Service"
$FullTag = "$ImageName`:$Version"
$LatestTag = "$ImageName`:latest"

Write-Host "[INFO] Building Docker image for $Service service" -ForegroundColor Blue
Write-Host "[INFO] Image: $FullTag" -ForegroundColor Blue

# Set build context and dockerfile
if ($Service -eq "bot") {
    $BuildContext = "./packages/bot"
    $Dockerfile = "Dockerfile"
} elseif ($Service -eq "client") {
    $BuildContext = "./packages/client"
    $Dockerfile = "Dockerfile"
}

Write-Host "[INFO] Build context: $BuildContext" -ForegroundColor Blue
Write-Host "[INFO] Dockerfile: $Dockerfile" -ForegroundColor Blue

try {
    # Build the image
    Write-Host "[INFO] Building Docker image..." -ForegroundColor Blue
    docker build -t $FullTag -f "$BuildContext/$Dockerfile" $BuildContext
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Image built successfully: $FullTag" -ForegroundColor Green
    } else {
        throw "Docker build failed"
    }
    
    # Tag as latest if version is not 'latest'
    if ($Version -ne "latest") {
        docker tag $FullTag $LatestTag
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Tagged as latest: $LatestTag" -ForegroundColor Green
        }
    }
    
    # Push to registry if --push flag is provided
    if ($Push) {
        Write-Host "[INFO] Pushing images to Docker Hub..." -ForegroundColor Blue
        
        # Check if logged in to Docker Hub
        $dockerInfo = docker info 2>&1
        if ($dockerInfo -notmatch "Username:") {
            Write-Host "[WARNING] Not logged in to Docker Hub. Please run: docker login" -ForegroundColor Yellow
            Write-Host "[INFO] Attempting to push anyway..." -ForegroundColor Blue
        }
        
        # Push versioned tag
        docker push $FullTag
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Pushed: $FullTag" -ForegroundColor Green
        } else {
            throw "Failed to push $FullTag"
        }
        
        # Push latest tag if version is not 'latest'
        if ($Version -ne "latest") {
            docker push $LatestTag
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[SUCCESS] Pushed: $LatestTag" -ForegroundColor Green
            } else {
                throw "Failed to push $LatestTag"
            }
        }
        
        Write-Host "[SUCCESS] All images pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Images built but not pushed. Use -Push flag to push to registry." -ForegroundColor Yellow
        Write-Host "[INFO] To push manually: docker push $FullTag" -ForegroundColor Blue
    }
    
    Write-Host "[SUCCESS] Build completed for $Service service (version: $Version)" -ForegroundColor Green
    
} catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
