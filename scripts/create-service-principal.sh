#!/bin/bash

# Variables
SERVICE_PRINCIPAL_NAME="your-service-principal-name"
ROLE="your-role"
SUBSCRIPTION_ID="your-subscription-id"
RESOURCE_GROUP_NAME="your-resource-group-name"
SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"

# Create the service principal
az ad sp create-for-rbac --name "$SERVICE_PRINCIPAL_NAME" --role "$ROLE" --scopes "$SCOPE" --sdk-auth

# Note: The --sdk-auth parameter outputs a JSON object that can be used for authentication in SDKs.