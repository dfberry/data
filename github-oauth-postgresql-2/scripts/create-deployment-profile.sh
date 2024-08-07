az webapp deployment list-publishing-profiles \
  --subscription "1-Pay-As-You-Go" \
  --resource-group nextjs-github-app \
  --name github-source-board \
  --xml > publishProfile.xml