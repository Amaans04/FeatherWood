# FeatherWood

steps to deploy on vercel :
 cd to client and 'npm run build'
 cd back to root directory
 remeber to add this code to dist folder in file : "vercel.json": "{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}"
 cd to dist folder then vercel -dist