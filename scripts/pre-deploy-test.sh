#!/bin/bash

# Pre-deployment test script for Decory

echo "🚀 Starting pre-deployment tests for Decory..."

# Check if environment variables are set
echo "📋 Checking environment variables..."
if [ -f .env.local ]; then
    echo "✅ .env.local found"
else
    echo "❌ .env.local not found. Copy .env.example to .env.local and configure."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npm run db:generate

# Type checking
echo "🔍 Running type check..."
npm run type-check

# Linting
echo "🧹 Running linter..."
npm run lint

# Build the project
echo "🏗️  Building project..."
npm run build

# Test the build
echo "🧪 Testing build..."
timeout 30s npm run start &
SERVER_PID=$!

# Wait for server to start
sleep 10

# Check if server is responding
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Build test successful!"
else
    echo "❌ Build test failed - server not responding"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Kill the test server
kill $SERVER_PID 2>/dev/null

echo "🎉 All pre-deployment tests passed!"
echo ""
echo "Next steps:"
echo "1. Commit and push your code to GitHub"
echo "2. Deploy to Vercel: vercel --prod"
echo "3. Set up your domain in Vercel dashboard"
echo "4. Configure DNS in Namecheap"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."