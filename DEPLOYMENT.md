# Deployment Guide - EyeLux E-commerce Platform

This guide will walk you through deploying the EyeLux e-commerce platform to Vercel.

## 🚀 Prerequisites

Before deploying, ensure you have:

1. **GitHub Account**: Your code should be pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MySQL Database**: Set up a production MySQL database (PlanetScale, Railway, or similar)
4. **Stripe Account**: For payment processing
5. **Cloudinary Account**: For image management

## 📋 Pre-Deployment Checklist

### 1. Database Setup

Choose a MySQL database provider:

**Option A: PlanetScale (Recommended)**
- Sign up at [planetscale.com](https://planetscale.com)
- Create a new database
- Get your connection string

**Option B: Railway**
- Sign up at [railway.app](https://railway.app)
- Create a new MySQL service
- Get your connection string

**Option C: AWS RDS**
- Set up MySQL RDS instance
- Configure security groups
- Get your connection string

### 2. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard:
   - Publishable key (starts with `pk_test_` or `pk_live_`)
   - Secret key (starts with `sk_test_` or `sk_live_`)
3. Set up webhook endpoint (we'll configure this after deployment)

### 3. Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials:
   - Cloud name
   - API key
   - API secret

## 🚀 Deploy to Vercel

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing your EyeLux code

### Step 2: Configure Project

1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `./` (or `eyelux-next` if in subdirectory)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### Step 3: Environment Variables

Add the following environment variables in Vercel:

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## 🔧 Post-Deployment Setup

### 1. Database Migration

After deployment, run database migrations:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

You can run these commands in Vercel's function logs or locally with the production database URL.

### 2. Stripe Webhook Setup

1. Go to your Stripe Dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook secret and add it to your environment variables

### 3. Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your custom domain

## 🔍 Testing Your Deployment

### 1. Basic Functionality

- ✅ Homepage loads
- ✅ Product listing works
- ✅ Search and filtering work
- ✅ User registration/login works
- ✅ Cart functionality works
- ✅ Checkout process works

### 2. Payment Testing

Use Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expired**: `4000 0000 0000 0069`

### 3. Database Testing

- ✅ User registration creates database records
- ✅ Orders are saved to database
- ✅ Cart items persist

## 🛠️ Troubleshooting

### Common Issues

**1. Database Connection Errors**
- Check `DATABASE_URL` format
- Ensure database is accessible from Vercel
- Verify database credentials

**2. Authentication Issues**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure database tables are created

**3. Stripe Payment Failures**
- Verify Stripe keys are correct
- Check webhook endpoint is configured
- Test with Stripe test mode first

**4. Image Upload Issues**
- Verify Cloudinary credentials
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Ensure Cloudinary account is active

### Debugging

1. **Check Vercel Logs**: Go to your project dashboard → Functions → View logs
2. **Database Logs**: Check your database provider's logs
3. **Stripe Logs**: Check Stripe dashboard for webhook failures
4. **Browser Console**: Check for client-side errors

## 🔒 Security Considerations

### Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use Vercel's environment variable encryption
- ✅ Rotate secrets regularly
- ✅ Use different keys for development and production

### Database Security

- ✅ Use strong database passwords
- ✅ Enable SSL connections
- ✅ Restrict database access to Vercel IPs
- ✅ Regular database backups

### Payment Security

- ✅ Use Stripe's secure payment methods
- ✅ Never handle raw credit card data
- ✅ Implement proper error handling
- ✅ Use webhook signatures for verification

## 📊 Monitoring

### Vercel Analytics

- Enable Vercel Analytics for performance monitoring
- Monitor Core Web Vitals
- Track user engagement

### Error Monitoring

Consider adding error monitoring services:
- Sentry
- LogRocket
- Bugsnag

### Database Monitoring

- Monitor database performance
- Set up alerts for connection issues
- Track query performance

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys on:
- Push to main branch
- Pull request creation
- Manual deployment trigger

### Deployment Previews

- Each PR gets a preview URL
- Test changes before merging
- Share previews with stakeholders

## 📈 Performance Optimization

### Vercel Optimizations

- ✅ Automatic image optimization
- ✅ Edge caching
- ✅ CDN distribution
- ✅ Automatic HTTPS

### Application Optimizations

- ✅ Next.js App Router optimizations
- ✅ Image optimization with Next.js Image
- ✅ Code splitting
- ✅ Lazy loading

## 🆘 Support

If you encounter issues:

1. Check Vercel documentation
2. Review Next.js deployment guide
3. Check Prisma deployment docs
4. Contact Vercel support
5. Open issues in the project repository

## 🎯 Next Steps

After successful deployment:

1. Set up monitoring and analytics
2. Configure backup strategies
3. Plan for scaling
4. Set up development workflow
5. Document deployment procedures

---

Your EyeLux e-commerce platform is now live! 🎉
