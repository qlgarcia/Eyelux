# EyeLux - Premium Eyewear E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui for selling premium eyewear products.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure sign-up and login with NextAuth.js
- **Product Catalog**: Browse products with search, filtering, and sorting
- **Shopping Cart**: Add, remove, and update cart items
- **Checkout Process**: Complete checkout with Stripe payment integration
- **Order Management**: View order history and track order status
- **Responsive Design**: Mobile-first design that works on all devices
- **Wishlist**: Save products for later viewing
- **Product Reviews**: Rate and review purchased products

### Technical Features
- **Next.js 15 App Router**: Latest Next.js with App Router for optimal performance
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Beautiful, accessible UI components
- **Prisma ORM**: Type-safe database queries with MySQL
- **NextAuth.js**: Authentication with credentials provider
- **Stripe Integration**: Secure payment processing
- **Cloudinary**: Image upload and management
- **SQL LIKE Search**: Efficient product search functionality
- **Vercel Ready**: Optimized for deployment on Vercel

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Image Management**: Cloudinary
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- MySQL database
- Stripe account (for payments)
- Cloudinary account (for images)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eyelux-next
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/eyelux_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

Generate Prisma client and push the schema:

```bash
npm run db:generate
npm run db:push
```

### 5. Seed the Database

Populate the database with sample data:

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
eyelux-next/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── orders/            # Order history page
│   │   └── products/          # Product pages
│   ├── components/            # React components
│   │   ├── layout/            # Layout components
│   │   ├── providers/         # Context providers
│   │   └── ui/                # shadcn/ui components
│   └── lib/                   # Utility libraries
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── env.example               # Environment variables template
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Customer accounts and authentication
- **Products**: Product catalog with categories
- **Orders**: Order management and tracking
- **Cart Items**: Shopping cart functionality
- **Addresses**: Shipping and billing addresses
- **Reviews**: Product reviews and ratings
- **Categories**: Product categorization

## 🔐 Authentication

The application uses NextAuth.js with credentials provider for authentication. Users can:

- Register new accounts
- Sign in with email/password
- Access protected routes
- Manage their profile

## 💳 Payment Processing

Stripe integration provides secure payment processing:

- Stripe Checkout for payment collection
- Support for major credit cards
- Secure payment processing
- Order confirmation and tracking

## 🖼️ Image Management

Cloudinary integration for image handling:

- Product image uploads
- Image optimization and transformation
- CDN delivery for fast loading

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

Ensure all environment variables are configured in your production environment:

- Database connection string
- NextAuth secret
- Stripe keys
- Cloudinary credentials
- App URL

## 🧪 Testing

The application includes:

- TypeScript for type safety
- ESLint for code quality
- Responsive design testing
- Payment flow testing with Stripe test mode

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🔍 Search and Filtering

Advanced product search and filtering:

- SQL LIKE search functionality
- Category filtering
- Price range filtering
- Sorting options (name, price, newest)
- Real-time search results

## 🛒 Shopping Cart

Full-featured shopping cart:

- Add/remove items
- Quantity updates
- Price calculations
- Persistent cart data
- Stock validation

## 📦 Order Management

Complete order lifecycle:

- Order creation
- Payment processing
- Order tracking
- Status updates
- Order history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🎯 Roadmap

Future features planned:

- Admin dashboard
- Advanced analytics
- Email notifications
- Multi-language support
- Advanced product variants
- Customer support chat
- Loyalty program
- Advanced inventory management

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
