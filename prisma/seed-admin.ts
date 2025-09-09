import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

function generateStrongPassword(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>/?"
  let pwd = ""
  for (let i = 0; i < length; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)]
  }
  return pwd
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com"
  const plainPassword = process.env.ADMIN_PASSWORD || generateStrongPassword(18)
  const name = process.env.ADMIN_NAME || "Store Admin"

  const passwordHash = bcrypt.hashSync(plainPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      email,
      name,
      password: passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  })

  // eslint-disable-next-line no-console
  console.log("✅ Admin user ready:")
  // eslint-disable-next-line no-console
  console.log(`  Email: ${admin.email}`)
  // eslint-disable-next-line no-console
  console.log(`  Password: ${plainPassword}${process.env.ADMIN_PASSWORD ? " (from ADMIN_PASSWORD env)" : " (auto-generated)"}`)
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("❌ Failed to seed admin:", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


