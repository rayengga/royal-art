# 🔧 Fixing Vercel Environment Variables

## The Problem

The API routes are returning 500 errors because the `DATABASE_URL` environment variable contains the full `psql` command instead of just the connection string.

## ✅ Quick Fix via Vercel Dashboard

1. **Go to Environment Variables**:
   Visit: https://vercel.com/rayenggas-projects/co2-v1-0/settings/environment-variables

2. **Edit DATABASE_URL**:
   - Find `DATABASE_URL` in the list
   - Click the **three dots** (⋯) menu
   - Click **Edit**
   
3. **Replace with correct value**:
   ```
   postgresql://neondb_owner:npg_MDaOFpcJ5K4u@ep-autumn-wind-ad6911nq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
   
   ⚠️ **Important**: 
   - Remove `psql '` from the beginning
   - Remove `'` from the end
   - Remove `&channel_binding=require` from the end
   - It should start with `postgresql://` 

4. **Save Changes**

5. **Redeploy**:
   - Go to the **Deployments** tab
   - Click **⋯** on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

## 🧪 Test After Fix

Visit these URLs to verify everything works:

1. Health Check: https://co2-v1-0.vercel.app/api/health
2. Categories: https://co2-v1-0.vercel.app/api/categories
3. Products: https://co2-v1-0.vercel.app/api/products
4. Homepage: https://co2-v1-0.vercel.app

All should return data without requiring authentication.

## 📋 Correct vs Incorrect Format

### ❌ INCORRECT (what you entered):
```
psql 'postgresql://neondb_owner:npg_MDaOFpcJ5K4u@ep-autumn-wind-ad6911nq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

### ✅ CORRECT (what it should be):
```
postgresql://neondb_owner:npg_MDaOFpcJ5K4u@ep-autumn-wind-ad6911nq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 🔄 Alternative: Fix via CLI

If you prefer using the terminal:

```bash
# Navigate to project
cd /Users/bilelhajji/Documents/co2-v1.0

# Remove the incorrect value
vercel env rm DATABASE_URL production --yes

# Add the correct value (when prompted, paste ONLY the connection string)
vercel env add DATABASE_URL production

# When prompted for value, paste:
postgresql://neondb_owner:npg_MDaOFpcJ5K4u@ep-autumn-wind-ad6911nq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Select "Production" when asked for environment

# Redeploy
vercel --prod
```

## ✅ Expected Results After Fix

- ✅ Homepage loads with products and categories
- ✅ Shop page shows all products
- ✅ Product details work
- ✅ No authentication required for public pages
- ✅ Admin pages still require login
- ✅ Cart and checkout work

## 🎯 Public vs Protected Routes

### Public Routes (No Auth Required):
- `/` - Homepage
- `/shop` - Shop page
- `/product/[id]` - Product details
- `/about` - About page
- `/contact` - Contact page
- `/api/products` - Products API
- `/api/categories` - Categories API
- `/api/products/[id]` - Single product API

### Protected Routes (Auth Required):
- `/admin/*` - All admin pages
- `/profile` - User profile
- `/api/admin/*` - Admin APIs
- `/api/orders` - Orders API (user's own orders)

This is already correctly implemented in your code!