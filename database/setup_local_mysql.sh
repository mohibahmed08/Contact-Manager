#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCHEMA_FILE="$ROOT_DIR/database/db.sql"
MYSQL_BIN="${MYSQL_BIN:-mysql}"
MYSQL_HOST="${MYSQL_HOST:-127.0.0.1}"
MYSQL_PORT="${MYSQL_PORT:-3306}"

if ! command -v "$MYSQL_BIN" >/dev/null 2>&1; then
    echo "MySQL client not found. Set MYSQL_BIN or install mysql first."
    exit 1
fi

MYSQL_ADMIN_USER="${MYSQL_ADMIN_USER:-root}"

read -r -p "MySQL admin user [${MYSQL_ADMIN_USER}]: " INPUT_ADMIN_USER
if [ -n "${INPUT_ADMIN_USER}" ]; then
    MYSQL_ADMIN_USER="${INPUT_ADMIN_USER}"
fi

read -r -s -p "MySQL password for ${MYSQL_ADMIN_USER} (leave blank if none): " MYSQL_ADMIN_PASSWORD
echo

mysql_admin() {
    if [ -n "$MYSQL_ADMIN_PASSWORD" ]; then
        MYSQL_PWD="$MYSQL_ADMIN_PASSWORD" "$MYSQL_BIN" -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_ADMIN_USER" "$@"
    else
        "$MYSQL_BIN" -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_ADMIN_USER" "$@"
    fi
}

echo "Creating local database and API user..."
mysql_admin <<'SQL'
CREATE DATABASE IF NOT EXISTS ContactManager;
CREATE USER IF NOT EXISTS 'API'@'localhost' IDENTIFIED BY 'admin1234';
ALTER USER 'API'@'localhost' IDENTIFIED BY 'admin1234';
GRANT ALL PRIVILEGES ON ContactManager.* TO 'API'@'localhost';
FLUSH PRIVILEGES;
SQL

TABLE_COUNT="$(mysql_admin -N -B -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='ContactManager' AND table_name IN ('Users', 'Contacts');")"

if [ "$TABLE_COUNT" -lt 2 ]; then
    echo "Importing schema from $SCHEMA_FILE..."
    mysql_admin < "$SCHEMA_FILE"
else
    echo "Existing tables detected. Preserving data and ensuring current Contacts columns exist..."
    FAVORITE_COLUMN_COUNT="$(mysql_admin -N -B -e "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema='ContactManager' AND table_name='Contacts' AND column_name='IsFavorite';")"
    IMAGE_COLUMN_COUNT="$(mysql_admin -N -B -e "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema='ContactManager' AND table_name='Contacts' AND column_name='image';")"
    IMAGE_DATA_COLUMN_COUNT="$(mysql_admin -N -B -e "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema='ContactManager' AND table_name='Contacts' AND column_name='imageData';")"

    if [ "$FAVORITE_COLUMN_COUNT" -eq 0 ]; then
        mysql_admin -D ContactManager -e "ALTER TABLE Contacts ADD COLUMN IsFavorite TINYINT(1) NOT NULL DEFAULT 0 AFTER Email;"
    else
        echo "Favorites column already exists."
    fi

    if [ "$IMAGE_COLUMN_COUNT" -eq 0 ]; then
        mysql_admin -D ContactManager -e "ALTER TABLE Contacts ADD COLUMN image LONGBLOB AFTER DateCreated;"
    else
        echo "Image column already exists."
    fi

    if [ "$IMAGE_DATA_COLUMN_COUNT" -eq 0 ]; then
        mysql_admin -D ContactManager -e "ALTER TABLE Contacts ADD COLUMN imageData VARCHAR(50) AFTER image;"
    else
        echo "Image data column already exists."
    fi
fi

echo "Local MySQL setup complete."
echo "You can now use the app with the default local API credentials."
