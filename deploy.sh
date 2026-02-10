#!/bin/bash

set -e

FRONTEND_DIR="/root/src/studiomar/frontend"
PROJECT_DIR="/root/src/studiomar"

echo "🚀 Starting deployment..."

# Frontend build
echo "📦 Building frontend..."
cd "$FRONTEND_DIR"

echo "  Installing dependencies..."
npm install --legacy-peer-deps > /dev/null 2>&1

echo "  Building..."
npm run build

# Reload nginx
echo "🔄 Reloading nginx..."
nginx -t > /dev/null 2>&1
systemctl restart nginx

echo "✅ Deployment complete!"
echo "📍 Frontend: $FRONTEND_DIR/dist"
echo "🌐 Site: https://studiomar.nuovicomici.com/"
