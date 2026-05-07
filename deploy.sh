#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found!"
  echo "Please create a .env file with all required environment variables."
  exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "❌ Error: docker-compose is not installed!"
  echo "Please install docker-compose to use this deployment script."
  exit 1
fi

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Build and start the containers
echo "🔨 Building Docker image..."
docker-compose build --no-cache

echo "🚀 Starting containers..."
docker-compose up -d

# Show container status
echo "📊 Container status:"
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Application is running on http://localhost:3000"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down" 