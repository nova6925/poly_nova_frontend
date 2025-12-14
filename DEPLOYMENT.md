# Deployment Guide - Poly Nova Frontend

Deploy your React frontend to Vercel or Netlify for free.

---

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Steps

1. **Push to GitHub**
   ```bash
   cd poly_nova_frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/poly_nova_frontend.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your `poly_nova_frontend` repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `./`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
   - Click "Deploy"

3. **Get Your URL**
   - Your app will be live at: `https://poly-nova-frontend.vercel.app`
   - You can add a custom domain in Settings → Domains

### Continuous Deployment
Every push to `main` branch automatically deploys! 🚀

---

## Option 2: Deploy to Netlify

### Prerequisites
- GitHub account
- Netlify account (sign up at [netlify.com](https://netlify.com))

### Steps

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `poly_nova_frontend`
   - Configure:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `dist`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
   - Click "Deploy site"

3. **Get Your URL**
   - Your app will be live at: `https://poly-nova-frontend.netlify.app`
   - You can customize the subdomain or add a custom domain

---

## Environment Variables

Make sure to set `VITE_API_URL` to your deployed backend URL:

```
VITE_API_URL=https://poly-nova-backend.onrender.com
```

---

## Custom Domain (Optional)

### Buy a Domain
- Purchase from [Namecheap](https://namecheap.com) or [Google Domains](https://domains.google)
- Cost: ~$10-15/year

### Add to Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., `polymarket.com`)
3. Follow DNS configuration instructions

### Add to Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records at your registrar

---

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node version (should be 18+)
- Check build logs for specific errors

### API Not Working
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is deployed and running

### Environment Variables Not Working
- Environment variables must start with `VITE_`
- Redeploy after adding new variables
- Check deployment logs

---

## Cost

**Free Forever!** 🎉

Both Vercel and Netlify offer generous free tiers:
- Unlimited personal projects
- Automatic HTTPS
- Global CDN
- Continuous deployment

---

## Next Steps

1. ✅ Deploy frontend
2. 🔗 Update `VITE_API_URL` with backend URL
3. 🌐 Add custom domain (optional)
4. 📊 Monitor analytics in Vercel/Netlify dashboard
