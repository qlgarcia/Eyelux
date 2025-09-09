#!/bin/bash

echo "🚀 EyeLux E-commerce Platform Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your configuration before continuing."
    echo "   Required variables:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - STRIPE_PUBLISHABLE_KEY"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - CLOUDINARY_API_KEY"
    echo "   - CLOUDINARY_API_SECRET"
    echo ""
    read -p "Press Enter after updating .env.local to continue..."
else
    echo "✅ .env.local already exists"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npm run db:generate

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Test the application with the sample data"
echo ""
echo "Test credentials:"
echo "Email: test@example.com"
echo "Password: password123"
echo ""
echo "Happy coding! 🚀"
