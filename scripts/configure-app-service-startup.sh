SUBSCRIPTION="1-Pay-As-You-Go"
WEB_APP_NAME="github-source-board"
RESOURCE_GROUP_NAME="nextjs-github-app"

command=$(az webapp config set \
    --subscription "$SUBSCRIPTION" \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --name "$WEB_APP_NAME" \
    --startup-file "node .next/standalone/server.js")

echo "$command"