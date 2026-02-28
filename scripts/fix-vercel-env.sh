#!/bin/bash

# Script to properly configure Vercel environment variables

echo "🔧 Configuring Vercel Environment Variables"
echo "==========================================="

echo ""
echo "⚠️  IMPORTANT: When prompted, enter ONLY the values (no quotes, no extra text)"
echo ""

# DATABASE_URL
echo "📋 Setting DATABASE_URL..."
echo "Enter this value:"
echo "postgresql://neondb_owner:npg_MDaOFpcJ5K4u@ep-autumn-wind-ad6911nq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
echo ""

# Remove old value
vercel env rm DATABASE_URL production --yes 2>/dev/null || true

# Add new value
echo "DATABASE_URL=postgresql://neondb_owner:npg_MDaOFpcJ5K4u@ep-autumn-wind-ad6911nq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" | vercel env add DATABASE_URL production

echo ""
echo "✅ Environment variables updated!"
echo ""
echo "🚀 Redeploying..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "Check your site: https://co2-v1-0.vercel.app"