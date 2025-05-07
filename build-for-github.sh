#!/bin/bash

echo "Building frontend-only static site for GitHub Pages..."

# Build the frontend application using the static config
npx vite build --config vite.config.static.ts

echo "✓ Build completed!"
echo ""
echo "DEPLOYMENT INSTRUCTIONS:"
echo "------------------------"
echo "1. Create a new repository on GitHub"
echo "2. Upload all files from the 'github-build' directory to the repository"
echo "3. Go to the repository settings and enable GitHub Pages"
echo "4. Set the source to the main branch and root directory"
echo "5. Your site will be available at https://[your-username].github.io/[repository-name]"
echo ""
echo "The built files are in the 'github-build' directory."