#!/usr/bin/env bash
#
# Dumps the YieldSense AI PostgreSQL database to a timestamped, gzip-
# compressed .sql file in ./backups/. Reads connection details from the
# environment (same variable names as backend/.env: DB_HOST, DB_PORT,
# DB_NAME, DB_USER, DB_PASSWORD) so it can be sourced from a real .env
# file or exported by cron / CI directly.
#
# Usage:
#   export DB_HOST=localhost DB_PORT=5432 DB_NAME=yieldsense_db \
#          DB_USER=postgres DB_PASSWORD=postgres
#   ./backend/scripts/backup_db.sh
#
# Cron example (daily at 2am, loading vars from backend/.env first):
#   0 2 * * * set -a; . /path/to/backend/.env; set +a; /path/to/backend/scripts/backup_db.sh >> /var/log/yieldsense_backup.log 2>&1

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$SCRIPT_DIR/../backups}"

usage() {
    cat <<'EOF'
Usage: DB_HOST=<host> DB_PORT=<port> DB_NAME=<name> DB_USER=<user> DB_PASSWORD=<password> ./backup_db.sh

Required environment variables (matching backend/.env):
  DB_HOST      Postgres host (e.g. localhost, or "postgres" under docker compose)
  DB_NAME      Database name (e.g. yieldsense_db)
  DB_USER      Database user (e.g. postgres)
  DB_PASSWORD  Database password

Optional:
  DB_PORT      Postgres port (default: 5432)
  BACKUP_DIR   Where to write the dump (default: backend/backups)

Output:
  <BACKUP_DIR>/<DB_NAME>_<UTC timestamp>.sql.gz

Requires the `pg_dump` client to be installed and on PATH.
EOF
}

missing=()
for var in DB_HOST DB_NAME DB_USER DB_PASSWORD; do
    if [ -z "${!var:-}" ]; then
        missing+=("$var")
    fi
done

if [ "${#missing[@]}" -gt 0 ]; then
    echo "Error: missing required environment variable(s): ${missing[*]}" >&2
    echo >&2
    usage
    exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
    echo "Error: pg_dump not found on PATH. Install the postgresql-client package." >&2
    exit 1
fi

DB_PORT="${DB_PORT:-5432}"

mkdir -p "$BACKUP_DIR"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
outfile="$BACKUP_DIR/${DB_NAME}_${timestamp}.sql.gz"

echo "Backing up database '$DB_NAME' on $DB_HOST:$DB_PORT to $outfile ..."

PGPASSWORD="$DB_PASSWORD" pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --no-password \
    --format=plain \
    "$DB_NAME" | gzip > "$outfile"

echo "Backup complete: $outfile ($(du -h "$outfile" | cut -f1))"
