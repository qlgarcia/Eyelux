#!/bin/bash

# EyeLux Free Deployment Setup Script
echo "🚀 Setting up EyeLux for free deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual API keys"
else
    echo "✅ .env.local already exists"
fi

# Create database and run migrations
echo "🗄️  Setting up database..."
npx prisma db push

# Seed admin user
echo "👤 Seeding admin user..."
npm run db:seed:admin

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your API keys:"
echo "   - Cloudinary credentials"
echo "   - Stripe test keys"
echo "   - NextAuth secret"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Visit http://localhost:3000"
echo ""
echo "4. Admin login:"
echo "   Email: admin@eyelux.com"
echo "   Password: admin123"
echo ""
echo "Happy coding! 🚀"
