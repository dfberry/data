az ad app create --display-name myApp

 az ad sp create --id $appId

 az role assignment create --role contributor --subscription $subscriptionId --assignee-object-id  $servicePrincipalId --assignee-principal-type ServicePrincipal --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName

 az ad app federated-credential create --id <APPLICATION-OBJECT-ID> --parameters credential.json
("credential.json" contains the following content)
{
    "name": "<CREDENTIAL-NAME>",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:octo-org/octo-repo:environment:Production",
    "description": "Testing",
    "audiences": [
        "api://AzureADTokenExchange"
    ]
}