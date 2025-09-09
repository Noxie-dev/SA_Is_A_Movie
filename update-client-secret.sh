#!/bin/bash

# Script to update Auth0 client secret in config file
# Usage: ./update-client-secret.sh "your-actual-client-secret"

if [ $# -eq 0 ]; then
    echo "❌ Error: Please provide your client secret as an argument"
    echo "Usage: ./update-client-secret.sh \"your-actual-client-secret\""
    echo ""
    echo "To get your client secret:"
    echo "1. Go to: https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie/applications"
    echo "2. Find your app (Client ID: EuWZO7zJRvldikvu4wwjDeLoL7HKX4s5)"
    echo "3. Go to Settings tab"
    echo "4. Copy the Client Secret"
    exit 1
fi

CLIENT_SECRET="$1"
CONFIG_FILE="auth0-cli-config.json"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Error: $CONFIG_FILE not found"
    exit 1
fi

# Update the client secret
sed -i.bak "s/REPLACE_WITH_YOUR_ACTUAL_CLIENT_SECRET/$CLIENT_SECRET/g" "$CONFIG_FILE"

echo "✅ Client secret updated successfully!"
echo "📁 Backup created: ${CONFIG_FILE}.bak"
echo ""
echo "🔍 You can now run Auth0 CLI commands:"
echo "   a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export"









