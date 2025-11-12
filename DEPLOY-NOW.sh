#!/bin/bash
# Quick Deployment Script for Vinhomes Quiz

echo "🚀 Vinhomes Quiz - Deployment Helper"
echo "====================================="
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Netlify CLI not found. Installing..."
    echo ""
    echo "Run: npm install -g netlify-cli"
    echo ""
    echo "Or deploy manually:"
    echo "1. Go to https://app.netlify.com/drop"
    echo "2. Drag and drop this entire folder"
    echo "3. Your site will be live in seconds!"
    exit 1
fi

echo "✅ Netlify CLI found"
echo ""

# Check if logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify first:"
    netlify login
fi

echo ""
echo "�� Deploying to Netlify..."
echo ""

# Deploy
netlify deploy --prod --dir=. --message="Deploy v1.1.0 - 30 MCQ Quiz"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test your live site"
echo "2. Verify Google Sheets integration"
echo "3. Share the URL with users"
echo ""
