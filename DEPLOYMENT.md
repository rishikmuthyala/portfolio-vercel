# 🚀 GitHub Pages Deployment Guide

## Prerequisites
- GitHub account
- Domain name (rishikmuthyala.xyz)
- Git installed on your computer

## Step-by-Step Deployment Instructions

### 1️⃣ Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it either:
   - `rishikmuthyala.github.io` (for user site - recommended)
   - Any name (for project site)

### 2️⃣ Initialize Git and Push Code
```bash
# Navigate to your portfolio directory
cd portfolio

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial portfolio commit"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to main branch
git push -u origin main
```

### 3️⃣ Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Build and deployment**:
   - Source: **GitHub Actions**
5. Save changes

### 4️⃣ Configure Custom Domain (rishikmuthyala.xyz)

#### On GitHub:
1. In repository **Settings** > **Pages**
2. Under **Custom domain**, enter: `rishikmuthyala.xyz`
3. Check **Enforce HTTPS**
4. Save

#### On Your Domain Provider (GoDaddy, Namecheap, etc.):
Add the following DNS records:

**For apex domain (rishikmuthyala.xyz):**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

**For www subdomain (optional):**
```
Type: CNAME
Name: www
Value: rishikmuthyala.github.io
```

### 5️⃣ Deploy Your Site

#### Option A: Automatic Deployment (Recommended)
The GitHub Actions workflow will automatically deploy when you push to main branch:
```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

#### Option B: Manual Build and Deploy
```bash
# Build the static site
npm run build

# The static files will be in the 'out' directory
# Push these to GitHub and the workflow will deploy them
```

### 6️⃣ Environment Variables
Create a `.env.production` file in your portfolio directory:
```env
NEXT_PUBLIC_SITE_URL=https://rishikmuthyala.xyz
# Add other public environment variables as needed
```

### 7️⃣ Verify Deployment
1. Wait 5-10 minutes for DNS propagation
2. Visit https://rishikmuthyala.xyz
3. Check GitHub Actions tab for deployment status

## Important Notes

### ⚠️ Limitations with Static Export
Since GitHub Pages only hosts static files, the following features will have limitations:
- **API Routes**: Won't work (chatbot will use client-side simulation)
- **Database**: No server-side database access
- **Dynamic Routes**: All routes must be generated at build time
- **Image Optimization**: Next.js Image optimization is disabled

### 🔧 Troubleshooting

**Site not loading?**
- Check GitHub Actions for build errors
- Verify DNS settings (may take up to 24 hours)
- Ensure CNAME file exists in public folder

**404 errors on routes?**
- Make sure all dynamic routes are generated at build time
- Check that output: 'export' is in next.config.ts

**Custom domain not working?**
- Verify DNS records are correct
- Wait for DNS propagation (up to 24 hours)
- Check GitHub Pages settings for domain verification

### 📝 Updating Your Site
Every time you want to update your portfolio:
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

The GitHub Actions workflow will automatically rebuild and deploy your site.

## Alternative: Vercel Deployment (Recommended for Full Features)
If you want to use all features including API routes and database:
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables
4. Deploy (automatic on every push)
5. Add custom domain in Vercel dashboard

Vercel offers better Next.js support with:
- ✅ API routes
- ✅ Database connections
- ✅ Image optimization
- ✅ Edge functions
- ✅ Analytics
