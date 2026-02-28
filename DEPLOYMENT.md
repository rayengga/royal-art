# Decory Deployment Guide

## 🚀 Deployment Steps

### 1. Prepare Environment Variables

Copy `.env.example` to `.env.local` for development:
```bash
cp .env.example .env.local
```

Update the following variables:

#### Required for Production:
- `DATABASE_URL`: Your PostgreSQL database URL
- `JWT_SECRET`: Strong secret key (32+ characters)
- `NEXTAUTH_SECRET`: Another strong secret key (32+ characters)
- `NEXTAUTH_URL`: Your domain URL
- `NEXT_PUBLIC_SITE_URL`: Your public domain URL

#### Recommended Cloud Databases:
- **Neon** (Free tier): https://neon.tech/
- **Supabase** (Free tier): https://supabase.com/
- **Railway**: https://railway.app/
- **PlanetScale**: https://planetscale.com/

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

### 3. Build and Test Locally

```bash
# Build the project
npm run build

# Test production build
npm run start
```

Visit http://localhost:3000 to verify everything works.

### 4. Deploy to Vercel (Recommended)

#### Option A: Deploy via Vercel Dashboard
1. Push your code to GitHub/GitLab/Bitbucket
2. Visit https://vercel.com/new
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

### 5. Connect Custom Domain (Namecheap)

#### In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add your domain: `yourdomain.com`
3. Add www subdomain: `www.yourdomain.com`

#### In Namecheap Dashboard:
1. Go to Domain List → Manage → Advanced DNS
2. Delete existing A/CNAME records for @ and www
3. Add these records:

**A Record:**
- Host: `@`
- Value: `76.76.21.21`
- TTL: Automatic

**CNAME Record:**
- Host: `www`
- Value: `cname.vercel-dns.com`
- TTL: Automatic

#### Verify Domain:
- Go back to Vercel and click "Verify"
- SSL will be automatically issued (5-30 minutes)

### 6. Environment Variables for Production

In Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
JWT_SECRET=your-32-character-secret-key-here
NEXTAUTH_SECRET=another-32-character-secret-key
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 7. Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Shop page displays products
- [ ] Product detail pages work
- [ ] Cart functionality works
- [ ] User registration/login works
- [ ] Admin panel is accessible
- [ ] All API routes respond correctly
- [ ] Images load properly
- [ ] Mobile responsiveness works
- [ ] SSL certificate is active

### 8. Monitoring & Maintenance

#### Vercel Analytics (Optional):
- Enable in Vercel dashboard for traffic insights

#### Database Monitoring:
- Monitor your database usage
- Set up backups if using cloud provider
- Watch for connection limits

#### Performance:
- Use Vercel's built-in performance monitoring
- Check Core Web Vitals
- Monitor API response times

## 🛠 Troubleshooting

### Common Issues:

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Database Connection Issues:**
- Verify DATABASE_URL is correct
- Check if database allows external connections
- Ensure SSL mode is enabled for production

**Environment Variable Issues:**
- Double-check all required variables are set
- Verify there are no typos in variable names
- Ensure secrets are properly generated

**Domain Connection Issues:**
- Wait 24-48 hours for DNS propagation
- Clear browser cache
- Use online DNS checkers to verify records

## 📊 Performance Tips

1. **Database Optimization:**
   - Use connection pooling
   - Add database indexes for frequently queried fields
   - Use database migrations for schema changes

2. **Image Optimization:**
   - Next.js automatically optimizes images
   - Use WebP format when possible
   - Implement lazy loading (already included)

3. **Caching:**
   - Vercel provides automatic edge caching
   - Use Next.js static generation where possible
   - Implement API route caching for data that doesn't change often

4. **Bundle Optimization:**
   - Tree shaking is enabled by default
   - Use dynamic imports for heavy components
   - Monitor bundle size with `npm run build`