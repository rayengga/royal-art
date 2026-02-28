# Decory - Laser Engraving eCommerce

Modern eCommerce website for Decory laser engraving business selling engraved leather and wood products.

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **State Management**: React Context

## 🛠 Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Git

### 1. Clone and Install

```bash
git clone <repository-url>
cd decory
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `decory_db`
3. Update the DATABASE_URL in `.env`

#### Option B: Cloud Database (Recommended)
Use services like:
- [Neon](https://neon.tech/) (Free tier available)
- [Supabase](https://supabase.com/) (Free tier available)
- [Railway](https://railway.app/)
- [PlanetScale](https://planetscale.com/)

### 3. Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update these variables in `.env`:
```env
DATABASE_URL="postgresql://decory_user:strong_password_here@localhost:5432/decory_db"
JWT_SECRET="your-super-secret-jwt-key-here"
```

### 4. Database Migration and Seeding

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Production Deployment

### Quick Deployment to Vercel + Namecheap Domain

1. **Prepare for deployment:**
   ```bash
   # Run pre-deployment tests
   ./scripts/pre-deploy-test.sh
   ```

2. **Set up database** (choose one):
   - [Neon](https://neon.tech/) - Free PostgreSQL
   - [Supabase](https://supabase.com/) - Free tier
   - [Railway](https://railway.app/) - Easy setup

3. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

4. **Connect Namecheap domain:**
   - Vercel: Add domain in project settings
   - Namecheap: Update DNS records (see DEPLOYMENT.md)

### Environment Variables for Production
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
JWT_SECRET="your-32-character-secret"
NEXTAUTH_SECRET="another-32-character-secret"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.**

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Build test
npm run build && npm run start

# Pre-deployment test
./scripts/pre-deploy-test.sh
```
