# 🚀 Decory Deployment Checklist

## Pre-Deployment Requirements

### ✅ 1. Environment Setup
- [ ] `.env.local` file created and configured
- [ ] Database URL configured (Neon/Supabase/Railway recommended)
- [ ] JWT secrets generated (32+ characters each)
- [ ] All required environment variables set

### ✅ 2. Database Setup
- [ ] Cloud database created (Neon/Supabase/Railway/PlanetScale)
- [ ] Connection URL obtained and tested
- [ ] Database schema pushed: `npm run db:push`
- [ ] Prisma client generated: `npm run db:generate`
- [ ] Optional: Sample data seeded: `npm run db:seed`

### ✅ 3. Code Quality
- [ ] TypeScript compilation successful: `npm run type-check`
- [ ] Production build successful: `NODE_ENV=production npm run build`
- [ ] No critical runtime errors in development: `npm run dev`

### ✅ 4. Repository Setup
- [ ] Code committed to Git repository
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is public or deployment service has access

## Vercel Deployment Steps

### ✅ 5. Vercel Account & Project
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] Repository imported to Vercel
- [ ] Project name set (e.g., "decory" or your preferred name)

### ✅ 6. Environment Variables in Vercel
Navigate to **Project Settings → Environment Variables** and add:

**Required Variables:**
- [ ] `DATABASE_URL` - Your database connection string
- [ ] `JWT_SECRET` - Strong secret (32+ chars)
- [ ] `NEXTAUTH_SECRET` - Another strong secret (32+ chars)  
- [ ] `NEXTAUTH_URL` - Your production domain (https://yourdomain.com)
- [ ] `NEXT_PUBLIC_SITE_URL` - Your public domain (https://yourdomain.com)

**Optional Variables:**
- [ ] `SMTP_HOST` - Email service host (for contact forms)
- [ ] `SMTP_PORT` - Email service port
- [ ] `SMTP_USER` - Email username  
- [ ] `SMTP_PASS` - Email password/app password

### ✅ 7. Initial Deployment
- [ ] Automatic deployment triggered on repository import
- [ ] Build completed successfully
- [ ] Deployment preview URL works (*.vercel.app)
- [ ] Basic functionality tested on preview URL

## Domain Setup (Namecheap)

### ✅ 8. Domain Configuration in Vercel
- [ ] Navigate to **Project Settings → Domains**
- [ ] Add primary domain: `yourdomain.com`
- [ ] Add www subdomain: `www.yourdomain.com`
- [ ] SSL certificate configuration initiated

### ✅ 9. DNS Configuration in Namecheap
- [ ] Login to Namecheap account
- [ ] Navigate to **Domain List → Manage → Advanced DNS**
- [ ] Delete existing conflicting records (A, CNAME, URL Redirect for @ and www)

**Add these DNS records:**

**A Record:**
- [ ] Host: `@` | Value: `76.76.21.21` | TTL: Automatic

**CNAME Record:**
- [ ] Host: `www` | Value: `cname.vercel-dns.com` | TTL: Automatic

### ✅ 10. Domain Verification
- [ ] Return to Vercel and click "Verify" for each domain
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] SSL certificate automatically issued
- [ ] HTTPS redirect configured

## Post-Deployment Verification

### ✅ 11. Functionality Testing
- [ ] **Homepage** loads correctly with animations
- [ ] **Shop** page displays products and filters work
- [ ] **Product detail** pages load with correct data
- [ ] **Cart** functionality (add/remove/update quantities)
- [ ] **User registration** creates accounts successfully
- [ ] **User login** authenticates correctly
- [ ] **Admin panel** accessible at `/admin`
- [ ] **API endpoints** respond correctly
- [ ] **Contact form** sends emails (if configured)

### ✅ 12. Performance & Security
- [ ] **Mobile responsiveness** works on different devices
- [ ] **Page load speed** is acceptable (use PageSpeed Insights)
- [ ] **SSL certificate** is active and valid
- [ ] **HTTPS redirect** works from HTTP URLs
- [ ] **Images** load correctly and are optimized
- [ ] **Database connections** are stable
- [ ] **Error pages** display properly (404, 500)

### ✅ 13. SEO & Analytics (Optional)
- [ ] **Meta tags** are properly set
- [ ] **Favicon** displays correctly
- [ ] **Social media previews** work (Open Graph)
- [ ] **Google Analytics** configured (if desired)
- [ ] **Search Console** configured (if desired)
- [ ] **Vercel Analytics** enabled (optional)

## Monitoring & Maintenance

### ✅ 14. Ongoing Monitoring
- [ ] **Vercel dashboard** bookmarked for deployments
- [ ] **Database provider dashboard** bookmarked for monitoring
- [ ] **Domain expiration** date noted
- [ ] **SSL certificate** auto-renewal confirmed
- [ ] **Error monitoring** set up (Vercel provides basic monitoring)

### ✅ 15. Backup & Recovery Plan
- [ ] **Database backups** enabled (check provider settings)
- [ ] **Repository** has proper version control
- [ ] **Environment variables** documented securely
- [ ] **Recovery procedure** documented

## Quick Deployment Commands

```bash
# Test build locally
NODE_ENV=production npm run build

# Deploy with Vercel CLI
npx vercel --prod

# Check deployment
curl -I https://yourdomain.com
```

## Troubleshooting Common Issues

### Build Failures
- Check environment variables are correctly set
- Verify database connection string
- Review build logs in Vercel dashboard

### Domain Issues
- Verify DNS records are correctly configured
- Wait for DNS propagation (up to 48 hours)
- Use online DNS checker tools

### Database Connection Issues  
- Check database provider status
- Verify connection string format
- Ensure database allows external connections

### SSL Issues
- Wait for automatic SSL provisioning (up to 30 minutes)
- Verify domain ownership
- Check for conflicting DNS records

---

## 🎉 Deployment Complete!

Once all items are checked, your Decory website should be live at:
- **Primary URL:** https://yourdomain.com
- **Admin Panel:** https://yourdomain.com/admin

**Support Resources:**
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Namecheap DNS Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain)