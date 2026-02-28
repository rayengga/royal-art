# 📤 Database Export Guide

## Quick Export Methods

### Method 1: Automated Script (Recommended)
```bash
# Run the export script
./scripts/export-database.sh
```

### Method 2: Manual pg_dump
```bash
# Create backup directory
mkdir -p database_backups

# Export full database (SQL format)
pg_dump -h localhost -U postgres -d decory_db \
  --no-owner --no-privileges --clean --if-exists \
  --exclude-table-data="_prisma_migrations" \
  > database_backups/decory_backup.sql

# Export only data (for existing schema)
pg_dump -h localhost -U postgres -d decory_db \
  --data-only --no-owner --no-privileges \
  --exclude-table="_prisma_migrations" \
  > database_backups/decory_data.sql
```

### Method 3: Prisma-based Export
```bash
# Generate schema
npm run db:generate

# Export data only (use Prisma for schema)
pg_dump -h localhost -U postgres -d decory_db \
  --data-only --no-owner --no-privileges \
  --exclude-table="_prisma_migrations" \
  > database_backups/decory_data.sql

# Schema is in prisma/schema.prisma
```

## 🌐 Import to Cloud Databases

### Neon (neon.tech)
```bash
# After creating Neon database
psql "postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require" < database_backups/decory_backup.sql
```

### Supabase
1. Go to SQL Editor in Supabase dashboard
2. Upload your `.sql` file
3. Execute the script

### Railway
```bash
# Connect to Railway PostgreSQL
psql "postgresql://postgres:password@containers-us-west-xxx.railway.app:6543/railway" < database_backups/decory_backup.sql
```

## 🔧 Troubleshooting

### Version Mismatch Error
If you get pg_dump version mismatch:
```bash
# Use libpq version
/opt/homebrew/Cellar/libpq/16.3/bin/pg_dump [options]

# Or install matching version
brew install postgresql@17
```

### Permission Issues
```bash
# Check database access
psql -h localhost -U postgres -d decory_db -c '\dt'

# Grant permissions if needed
psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE decory_db TO postgres;"
```

### Large Database
For large databases, use custom format:
```bash
pg_dump -Fc -h localhost -U postgres -d decory_db > decory_backup.dump
```

Then restore with:
```bash
pg_restore -d "cloud-database-url" decory_backup.dump
```

## 📋 What Gets Exported

✅ **Included:**
- All tables and data
- Indexes
- Sequences
- Foreign keys
- Check constraints

❌ **Excluded:**
- Ownership information (--no-owner)
- Permission grants (--no-privileges)  
- Prisma migration history
- Database-specific settings

## 🚀 Next Steps

1. **Export your database** using one of the methods above
2. **Create cloud database** (Neon/Supabase/Railway)
3. **Import the data** to cloud database
4. **Update Vercel environment variables** with new DATABASE_URL
5. **Test the connection** and redeploy