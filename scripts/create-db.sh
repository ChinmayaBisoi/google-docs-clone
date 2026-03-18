#!/usr/bin/env bash
# Create local Postgres database for development.
# Usage: ./scripts/create-db.sh [db_name]
# Or set: LOCAL_DB_NAME, PGHOST, PGPORT, PGUSER (defaults: app_dev, localhost, 5432, current user)

set -e

DB_NAME="${1:-${LOCAL_DB_NAME:-app_dev}}"
export PGHOST="${PGHOST:-localhost}"
export PGPORT="${PGPORT:-5432}"
export PGUSER="${PGUSER:-$USER}"

echo "Creating database: $DB_NAME (host=$PGHOST port=$PGPORT user=$PGUSER)"
psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"$DB_NAME\";"
echo "Done. Use LOCAL_DATABASE_URL=postgresql://$PGUSER@$PGHOST:$PGPORT/$DB_NAME"
