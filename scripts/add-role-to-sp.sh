#!/bin/bash

# Variables
SERVICE_PRINCIPAL_ID="your-service-principal-id"

# With Azure CLI, add role to service principal
CONTRIBUTOR_ROLE="b24988ac-6180-42a0-ab88-20f7382dd24c"
SUBSCRIPTION_ID="your-subscription-id"
RESOURCE_GROUP_NAME="your-resource-group-name"
SCOPE="/subscriptions/your-subscription-id/resourceGroups/your-resource-group-name"

# Add role to service principal
az role assignment create --assignee "$SERVICE_PRINCIPAL_ID" --role "$ROLE" --scope "$SCOPE"