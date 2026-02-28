#!/bin/bash

# Database Export Script for Decory
# This script exports your local database for migration to cloud providers

set -e  # Exit on any error

echo "🗄️  Database Export Script for Decory"
echo "====================================="

# Configuration
LOCAL_DB_NAME="decory_db"
LOCAL_DB_USER="postgres"  # Change if different
LOCAL_DB_HOST="localhost"
LOCAL_DB_PORT="5432"
BACKUP_DIR="database_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "📋 Checking database connection..."

# Check if database exists
if ! psql -h "$LOCAL_DB_HOST" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" -c '\q' 2>/dev/null; then
    echo "❌ Cannot connect to database. Please check:"
    echo "   - PostgreSQL is running"
    echo "   - Database '$LOCAL_DB_NAME' exists"
    echo "   - User '$LOCAL_DB_USER' has access"
    exit 1
fi

echo "✅ Database connection successful"

# Find compatible pg_dump
PG_DUMP_CMD=""
for pg_dump_path in "/opt/homebrew/Cellar/libpq/16.3/bin/pg_dump" \
                    "/opt/homebrew/Cellar/libpq/16.1_1/bin/pg_dump" \
                    "/usr/local/bin/pg_dump" \
                    "pg_dump"; do
    if command -v "$pg_dump_path" &> /dev/null; then
        PG_DUMP_CMD="$pg_dump_path"
        break
    fi
done

if [ -z "$PG_DUMP_CMD" ]; then
    echo "❌ pg_dump not found. Please install PostgreSQL client tools."
    exit 1
fi

echo "🔧 Using pg_dump: $PG_DUMP_CMD"

# Export options
echo ""
echo "📤 Choose export format:"
echo "1. SQL dump (for Neon, Supabase, Railway)"
echo "2. Custom format (for advanced use)"
echo "3. Schema only (structure without data)"
echo "4. Data only (data without structure)"
echo "5. Full export with Prisma migrate"

read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "🔄 Creating SQL dump..."
        BACKUP_FILE="$BACKUP_DIR/decory_${TIMESTAMP}.sql"
        $PG_DUMP_CMD -h "$LOCAL_DB_HOST" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" \
            --no-owner --no-privileges --clean --if-exists \
            --exclude-table-data="_prisma_migrations" > "$BACKUP_FILE"
        echo "✅ SQL dump created: $BACKUP_FILE"
        ;;
    2)
        echo "🔄 Creating custom format dump..."
        BACKUP_FILE="$BACKUP_DIR/decory_${TIMESTAMP}.dump"
        $PG_DUMP_CMD -h "$LOCAL_DB_HOST" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" \
            --format=custom --no-owner --no-privileges \
            --exclude-table-data="_prisma_migrations" > "$BACKUP_FILE"
        echo "✅ Custom dump created: $BACKUP_FILE"
        ;;
    3)
        echo "🔄 Creating schema-only dump..."
        BACKUP_FILE="$BACKUP_DIR/decory_schema_${TIMESTAMP}.sql"
        $PG_DUMP_CMD -h "$LOCAL_DB_HOST" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" \
            --schema-only --no-owner --no-privileges > "$BACKUP_FILE"
        echo "✅ Schema dump created: $BACKUP_FILE"
        ;;
    4)
        echo "🔄 Creating data-only dump..."
        BACKUP_FILE="$BACKUP_DIR/decory_data_${TIMESTAMP}.sql"
        $PG_DUMP_CMD -h "$LOCAL_DB_HOST" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" \
            --data-only --no-owner --no-privileges \
            --exclude-table="_prisma_migrations" > "$BACKUP_FILE"
        echo "✅ Data dump created: $BACKUP_FILE"
        ;;
    5)
        echo "🔄 Using Prisma migrate for schema + data export..."
        
        # Generate Prisma migration
        echo "📋 Generating Prisma schema dump..."
        npm run db:generate
        
        # Export data using Prisma
        BACKUP_FILE="$BACKUP_DIR/decory_data_${TIMESTAMP}.sql"
        $PG_DUMP_CMD -h "$LOCAL_DB_HOST" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" \
            --data-only --no-owner --no-privileges \
            --exclude-table="_prisma_migrations" > "$BACKUP_FILE"
            
        echo "✅ Prisma schema available in prisma/schema.prisma"
        echo "✅ Data dump created: $BACKUP_FILE"
        echo ""
        echo "📋 For cloud deployment:"
        echo "   1. Run 'npm run db:push' on cloud database"
        echo "   2. Import data from: $BACKUP_FILE"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Show file info
echo ""
echo "📊 Backup Information:"
echo "   File: $BACKUP_FILE"
echo "   Size: $(du -h "$BACKUP_FILE" | cut -f1)"
echo "   Location: $(pwd)/$BACKUP_FILE"

echo ""
echo "🚀 Next Steps for Cloud Migration:"
echo ""
echo "For Neon Database (neon.tech):"
echo "   1. Create account at neon.tech"
echo "   2. Create new database"
echo "   3. Use psql to import: psql 'your-neon-url' < $BACKUP_FILE"
echo ""
echo "For Supabase (supabase.com):"
echo "   1. Create project at supabase.com"
echo "   2. Go to SQL Editor"
echo "   3. Upload and run the SQL file"
echo ""
echo "For Railway (railway.app):"
echo "   1. Create PostgreSQL service"
echo "   2. Connect via psql"
echo "   3. Import: psql 'railway-url' < $BACKUP_FILE"

echo ""
echo "🔒 Remember to:"
echo "   - Keep your backup file secure"
echo "   - Test the import on cloud database"
echo "   - Update environment variables in Vercel"
echo "   - Delete local backup after successful migration"