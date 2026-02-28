#!/bin/bash

# Quick deployment script for Decory to Vercel

set -e  # Exit on any error

echo "🚀 Decory Quick Deployment Script"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  Warning: No .env.local or .env file found."
    echo "   Please copy .env.example to .env.local and configure it before deployment."
    read -p "   Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Installing dependencies..."
npm ci

echo "🔄 Generating Prisma client..."
npm run db:generate

echo "🔍 Running type check..."
npm run type-check

echo "🏗️  Testing production build..."
NODE_ENV=production npm run build

echo "✅ Build successful!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Starting deployment to Vercel..."
echo "   Follow the prompts to configure your project."

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Check your deployment status at: https://vercel.com/dashboard"
echo "2. Configure your custom domain in Vercel project settings"
echo "3. Update DNS records in Namecheap (see DEPLOYMENT.md)"
echo "4. Test your live site thoroughly"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - DEPLOYMENT.md - Full deployment guide"
echo "   - DEPLOYMENT-CHECKLIST.md - Step-by-step checklist"