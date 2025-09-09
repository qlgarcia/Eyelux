@echo off
echo 🚀 Setting up EyeLux for free deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    copy env.example .env.local
    echo ⚠️  Please update .env.local with your actual API keys
) else (
    echo ✅ .env.local already exists
)

REM Create database and run migrations
echo 🗄️  Setting up database...
npx prisma db push

REM Seed admin user
echo 👤 Seeding admin user...
npm run db:seed:admin

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your API keys:
echo    - Cloudinary credentials
echo    - Stripe test keys
echo    - NextAuth secret
echo.
echo 2. Start development server:
echo    npm run dev
echo.
echo 3. Visit http://localhost:3000
echo.
echo 4. Admin login:
echo    Email: admin@eyelux.com
echo    Password: admin123
echo.
echo Happy coding! 🚀
pause
