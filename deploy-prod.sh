#!/bin/bash

# Set error handling
set -e

# Local build process
echo "Starting local build process..."
npm install
npm run build
composer install --optimize-autoloader --no-dev

# Uncomment if needed
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

# Remote server details
REMOTE_HOST="pascalbr@pascalbr.ssh.cloud.hostpoint.ch"
SSH_KEY="~/.ssh/hostpoint_ssh"
REMOTE_DIR="www/test"

# Folders to upload
UPLOAD_FOLDERS=(
    "app"
    "artisan"
    "bootstrap"
    "composer.json"
    "composer.lock"
    "config"
    "database"
    "public"
    "resources"
    "routes"
    "storage"
)

echo "Connecting to remote server and uploading files..."

# Connect to SSH and execute commands
ssh -m hmac-sha2-512 -i "$SSH_KEY" "$REMOTE_HOST" "cd $REMOTE_DIR"

# Upload each folder
for item in "${UPLOAD_FOLDERS[@]}"; do
    echo "Uploading $item..."
    scp -r -i "$SSH_KEY" -o MACs=hmac-sha2-512 "$item" "$REMOTE_HOST:$REMOTE_DIR/$item"
done

# Clear caches on remote server
ssh -m hmac-sha2-512 -i "$SSH_KEY" "$REMOTE_HOST" "cd $REMOTE_DIR && php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan view:clear"

echo "Deployment completed successfully!"
exit 0
