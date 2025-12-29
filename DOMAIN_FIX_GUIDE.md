# 🌐 Fix Custom Domain: rishikmuthyala.xyz

## Current Status
✅ **DNS is correctly pointing to Vercel** (64.29.17.1, 64.29.17.65)  
❌ **Domain not configured in Vercel project** (SSL/TLS error)

## How to Fix (5 minutes)

### Step 1: Add Domain to Vercel Project

1. Go to [vercel.com](https://vercel.com) and log in
2. Select your **portfolio-vercel** project
3. Click **Settings** in the top navigation
4. Click **Domains** in the left sidebar
5. In the "Domain" field, enter: `rishikmuthyala.xyz`
6. Click **Add**

### Step 2: Configure Domain Settings

When you add the domain, Vercel will:
- ✅ Detect that DNS is already pointing to Vercel
- ✅ Automatically issue an SSL certificate (takes 1-2 minutes)
- ✅ Configure the domain for your project

You might see a warning initially - this is normal while the SSL certificate is being issued.

### Step 3: Add WWW Subdomain (Optional but Recommended)

While you're in the Domains section:
1. Add another domain: `www.rishikmuthyala.xyz`
2. Set it to redirect to `rishikmuthyala.xyz`

This ensures both `rishikmuthyala.xyz` and `www.rishikmuthyala.xyz` work.

### Step 4: Verify Configuration

After 1-2 minutes, check:
- Visit: https://rishikmuthyala.xyz
- You should see your portfolio site
- SSL certificate should be valid (green padlock in browser)

---

## Current DNS Configuration

Your DNS records are **correctly configured**:

```
Domain: rishikmuthyala.xyz
A Records: 64.29.17.1, 64.29.17.65
Status: Pointing to Vercel ✅
```

**You don't need to change your DNS settings** - they're already correct!

---

## Why This Happened

The Vercel bot merged security updates and the recent fixes were pushed, which may have triggered a re-deployment. However, if the domain wasn't explicitly added in the Vercel project settings, Vercel won't know to serve your site for that domain, even though DNS is pointing correctly.

---

## Alternative: Use Vercel CLI (If Dashboard Doesn't Work)

If you prefer using the command line:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Add the domain
vercel domains add rishikmuthyala.xyz
```

---

## What Your Vercel Dashboard Should Show

Under **Settings → Domains**, you should see:

```
Production Domains:
  rishikmuthyala.xyz          [Active] ✅
  www.rishikmuthyala.xyz      [Redirect to rishikmuthyala.xyz] ✅
  
Deployment Domains:
  portfolio-vercel-xxx.vercel.app   [Active] ✅
```

---

## Common Issues & Solutions

### Issue: "Domain is not configured"
**Solution:** Add the domain in Vercel dashboard (Settings → Domains)

### Issue: "Invalid configuration" 
**Solution:** Wait 1-2 minutes for SSL certificate to be issued

### Issue: "Domain already in use"
**Solution:** The domain might be assigned to another Vercel project. Remove it from the other project first.

### Issue: "DNS records not found"
**Solution:** This shouldn't happen since your DNS is already pointing to Vercel. If you see this, wait a few minutes and try again.

---

## Expected Timeline

- **Adding domain:** Instant
- **SSL certificate issuance:** 1-2 minutes
- **Domain becomes active:** 2-5 minutes
- **Global propagation:** Up to 24 hours (but usually works immediately)

---

## Verification Checklist

After adding the domain in Vercel:

- [ ] Visit https://rishikmuthyala.xyz - site loads ✅
- [ ] SSL certificate is valid (green padlock) ✅
- [ ] All pages work correctly ✅
- [ ] API routes respond (test chatbot) ✅
- [ ] Images load properly ✅

---

## Need Help?

If you still have issues after adding the domain:
1. Check Vercel dashboard for any error messages
2. Look at deployment logs in Vercel
3. Try removing and re-adding the domain
4. Contact Vercel support (they're very responsive)

---

## Summary

**The Problem:** Domain exists in DNS but isn't added to Vercel project  
**The Solution:** Add `rishikmuthyala.xyz` in Vercel Dashboard → Settings → Domains  
**Time to Fix:** 5 minutes (including SSL certificate issuance)

Your DNS is already perfect - you just need to tell Vercel to use it! 🚀

