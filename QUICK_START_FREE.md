# 🚀 Quick Start - Free Deployment

Get your EyeLux e-commerce platform running in **5 minutes** with **$0 cost**!

## ⚡ One-Command Setup

### Windows
```bash
setup-free.bat
```

### Mac/Linux
```bash
chmod +x setup-free.sh
./setup-free.sh
```

## 🔑 Get Your Free API Keys

### 1. Cloudinary (Free - 25GB)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free)
3. Copy your credentials from dashboard

### 2. Stripe (Free Test Mode)
1. Go to [stripe.com](https://stripe.com)
2. Sign up (free)
3. Get test keys from dashboard (test mode)

### 3. NextAuth Secret
Generate a random secret:
```bash
openssl rand -base64 32
```

## 📝 Update Environment

Edit `.env.local` with your keys:

```env
# Database (SQLite - Free)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Stripe (Test Mode - Free)
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Cloudinary (Free Tier)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🚀 Start Development

```bash
npm run dev
```

Visit: http://localhost:3000

## 👤 Admin Login

- **Email**: admin@eyelux.com
- **Password**: admin123

## 🌐 Deploy to Vercel (Free)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

**Full guide**: See `FREE_DEPLOYMENT_GUIDE.md`

## 🎯 What You Get

- ✅ Full e-commerce functionality
- ✅ Product management with images
- ✅ User authentication
- ✅ Shopping cart & wishlist
- ✅ Order management
- ✅ Admin dashboard
- ✅ Payment processing (test mode)
- ✅ Responsive design

## 💰 Cost: $0/month

- **Vercel**: Free tier
- **SQLite**: Free (embedded)
- **Cloudinary**: Free tier (25GB)
- **Stripe**: Free test mode

---

**Ready to go live?** Follow the full deployment guide! 🚀
