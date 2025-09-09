# 🚀 Free Deployment Guide - EyeLux E-commerce Platform

This guide will help you deploy your EyeLux e-commerce platform **completely free** using:

- ✅ **Next.js** (Free)
- ✅ **SQLite** (Free, embedded database)
- ✅ **Vercel** (Free tier)
- ✅ **Cloudinary** (Free tier - 25GB storage)
- ✅ **Stripe** (Test mode - Free)
- ✅ **NextAuth** (Free with credentials provider)

## 🎯 What You Get

- **Full e-commerce functionality** with $0 monthly cost
- **Product management** with image uploads
- **User authentication** and registration
- **Shopping cart** and wishlist
- **Order management** system
- **Admin dashboard** for managing products and orders
- **Payment processing** (test mode)
- **Responsive design** that works on all devices

## 📋 Prerequisites

Before starting, ensure you have:

1. **GitHub Account** (Free)
2. **Vercel Account** (Free tier)
3. **Cloudinary Account** (Free tier)
4. **Stripe Account** (Free for test mode)
5. **Node.js** installed locally (for development)

## 🛠️ Step 1: Local Setup

### 1.1 Clone and Install

```bash
# Clone your repository
git clone <your-repo-url>
cd eyelux-next

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate
```

### 1.2 Environment Setup

Create a `.env.local` file:

```env
# Database (SQLite - Free)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-make-it-long-and-random"

# Stripe (Test Mode - Free)
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"

# Cloudinary (Free Tier)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 1.3 Database Setup

```bash
# Create and seed the database
npm run db:push
npm run db:seed:admin
```

### 1.4 Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to test your application.

## 🌐 Step 2: Cloudinary Setup (Free Tier)

### 2.1 Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. You get **25GB storage** and **25GB bandwidth** per month

### 2.2 Get Your Credentials

1. Go to your Cloudinary Dashboard
2. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2.3 Update Environment Variables

Add your Cloudinary credentials to your `.env.local` file.

## 💳 Step 3: Stripe Setup (Test Mode - Free)

### 3.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. **Test mode is completely free** - no charges

### 3.2 Get Test API Keys

1. Go to Stripe Dashboard
2. Make sure you're in **Test mode** (toggle in top right)
3. Go to **Developers** → **API keys**
4. Copy your:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 3.3 Update Environment Variables

Add your Stripe test keys to your `.env.local` file.

## 🚀 Step 4: Deploy to Vercel (Free Tier)

### 4.1 Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for free deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 4.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click **"New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect it's a Next.js project

### 4.3 Configure Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-here-make-it-long-and-random"

# Stripe (Test Mode)
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# App
NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"
```

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your app will be live at `https://your-app-name.vercel.app`

## 🔧 Step 5: Post-Deployment Setup

### 5.1 Database Migration

After deployment, you need to set up the database. You can do this by:

1. **Option A: Use Vercel CLI** (Recommended)
   ```bash
   npm i -g vercel
   vercel login
   vercel env pull .env.local
   npx prisma db push
   npx prisma db seed
   ```

2. **Option B: Add a build script** (Alternative)
   Add this to your `package.json`:
   ```json
   "scripts": {
     "vercel-build": "prisma generate && prisma db push && next build"
   }
   ```

### 5.2 Stripe Webhook Setup

1. Go to your Stripe Dashboard
2. Navigate to **Webhooks**
3. Add endpoint: `https://your-app-name.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook secret and add it to Vercel environment variables

## 🧪 Step 6: Testing Your Free Deployment

### 6.1 Test Basic Functionality

- ✅ Homepage loads
- ✅ Product listing works
- ✅ User registration/login works
- ✅ Cart functionality works
- ✅ Image uploads work (via Cloudinary)
- ✅ Admin dashboard accessible

### 6.2 Test Payment Flow

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expired**: `4000 0000 0000 0069`

### 6.3 Test Admin Features

1. Go to `/admin/login`
2. Use the seeded admin credentials
3. Test product management
4. Test order management

## 📊 Free Tier Limits

### Vercel Free Tier
- **100GB bandwidth** per month
- **Unlimited** static deployments
- **12 serverless function executions** per month
- **Custom domains** supported

### Cloudinary Free Tier
- **25GB storage**
- **25GB bandwidth** per month
- **25,000 transformations** per month

### Stripe Test Mode
- **Completely free**
- **Unlimited** test transactions
- **No real charges**

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you:
- Push to the main branch
- Create a pull request
- Manually trigger deployment

### Development Workflow

1. Make changes locally
2. Test with `npm run dev`
3. Push to GitHub
4. Vercel automatically deploys
5. Test on live URL

## 🛠️ Troubleshooting

### Common Issues

**1. Database Connection Errors**
- Ensure `DATABASE_URL` is set correctly
- Check that Prisma client is generated
- Verify database file exists

**2. Image Upload Issues**
- Verify Cloudinary credentials
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Ensure Cloudinary account is active

**3. Authentication Issues**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure database tables are created

**4. Build Failures**
- Check Vercel build logs
- Ensure all environment variables are set
- Verify all dependencies are installed

### Debugging Steps

1. **Check Vercel Logs**: Go to your project dashboard → Functions → View logs
2. **Test Locally**: Run `npm run dev` and test all features
3. **Check Environment Variables**: Ensure all required variables are set
4. **Database Issues**: Run `npx prisma db push` to sync schema

## 🎉 You're Done!

Your EyeLux e-commerce platform is now live and running completely free! 

### What You Have:
- ✅ **Full e-commerce functionality**
- ✅ **Product management** with image uploads
- ✅ **User authentication** and registration
- ✅ **Shopping cart** and wishlist
- ✅ **Order management** system
- ✅ **Admin dashboard**
- ✅ **Payment processing** (test mode)
- ✅ **Responsive design**

### Next Steps:
1. **Test thoroughly** with the test payment cards
2. **Add your products** through the admin dashboard
3. **Customize the design** to match your brand
4. **Set up monitoring** (optional)
5. **Plan for scaling** when you're ready to go live

## 💡 Pro Tips

1. **Use Vercel Analytics** to monitor performance
2. **Set up error monitoring** with Sentry (free tier)
3. **Use Cloudinary's auto-optimization** for better performance
4. **Test on mobile devices** to ensure responsiveness
5. **Keep your dependencies updated** for security

## 🆘 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review Vercel documentation
3. Check Next.js deployment guide
4. Open an issue in your repository
5. Contact Vercel support (they're very helpful!)

---

**Congratulations!** 🎉 You now have a fully functional e-commerce platform running for free!
