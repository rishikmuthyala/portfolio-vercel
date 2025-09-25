# 🚀 GitHub Pages Deployment - Quick Setup Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Remove API Routes (Required for Static Export)
Since GitHub Pages only supports static files, temporarily move or delete these folders:
```bash
# Move API routes (they won't work on GitHub Pages)
mv src/app/api src/app/api.backup
mv src/app/s src/app/s.backup
```

### Step 2: Build Static Site
```bash
# Install dependencies
npm install

# Build the static site
npm run build

# Check the output folder
ls -la out/
```

### Step 3: Create GitHub Repository
1. Go to GitHub and create a new repository named: `rishikmuthyala.github.io`
2. Keep it public
3. Don't initialize with README

### Step 4: Push to GitHub
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial portfolio deployment"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/rishikmuthyala.github.io.git

# Push to main branch
git push -u origin main
```

### Step 5: Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **/ (root)**
5. Save

### Step 6: Add Custom Domain

#### In GitHub:
1. Settings → Pages → Custom domain
2. Enter: `rishikmuthyala.xyz`
3. Save and wait for DNS check

#### In Your Domain Provider:
Add these DNS records:

```
Type: A     Name: @    Value: 185.199.108.153
Type: A     Name: @    Value: 185.199.109.153
Type: A     Name: @    Value: 185.199.110.153
Type: A     Name: @    Value: 185.199.111.153
Type: CNAME Name: www  Value: rishikmuthyala.github.io
```

## 🎯 Alternative: Use GitHub Actions (Recommended)

### Create `.github/workflows/nextjs.yml`:
```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          
      - name: Install dependencies
        run: npm ci
        
      - name: Remove API routes
        run: |
          rm -rf src/app/api
          rm -rf src/app/s
          
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://rishikmuthyala.xyz
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then:
1. Go to Settings → Pages
2. Source: **GitHub Actions**
3. Push to main branch to trigger deployment

## 🌟 Better Alternative: Deploy to Vercel (Free + Full Features)

Vercel is better for Next.js apps because it supports:
- ✅ API routes (chatbot will work)
- ✅ Database connections
- ✅ Dynamic routes
- ✅ Image optimization
- ✅ Better performance

### Quick Vercel Setup:
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
5. Deploy (automatic)
6. Add custom domain in Vercel dashboard

## 📝 Features That Won't Work on GitHub Pages

- ❌ Chatbot (requires API routes)
- ❌ Contact form submission
- ❌ Link shortener
- ❌ Blog view counter
- ❌ ML Recommender API

These will show but won't have backend functionality.

## ✅ Features That Will Work

- ✅ Portfolio showcase
- ✅ Resume display
- ✅ Project galleries
- ✅ Mini apps (frontend only)
- ✅ Blog reading
- ✅ Theme switching
- ✅ Animations
- ✅ All static content

## 🔧 Quick Fixes for Deployment

If you get errors during build:

1. **Remove all API routes:**
```bash
rm -rf src/app/api
rm -rf src/app/s
```

2. **Update imports in components:**
Remove or comment out API calls in:
- `src/components/chat/FloatingChatWidget.tsx`
- `src/components/blog/BlogPost.tsx`
- `src/components/apps/ml-recommender/page.tsx`

3. **Build again:**
```bash
npm run build
```

## 📱 Test Your Deployment

After deployment (wait 5-10 minutes):
1. Visit: https://rishikmuthyala.xyz
2. Check all pages load
3. Test theme switching
4. Verify responsive design

## Need Help?

If you encounter issues:
1. Check GitHub Actions logs
2. Verify DNS settings (can take 24 hours)
3. Ensure CNAME file exists in public folder
4. Try Vercel instead for full features
