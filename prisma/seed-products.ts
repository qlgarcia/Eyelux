import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding sample products...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'sunglasses' },
      update: {},
      create: {
        name: 'Sunglasses',
        slug: 'sunglasses',
        description: 'Stylish and protective sunglasses',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'eyeglasses' },
      update: {},
      create: {
        name: 'Eyeglasses',
        slug: 'eyeglasses',
        description: 'Prescription and reading glasses',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Eye care accessories and cases',
        isActive: true,
      },
    }),
  ])

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { name: 'Ray-Ban' },
      update: {},
      create: {
        name: 'Ray-Ban',
        description: 'Classic American eyewear brand',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { name: 'Oakley' },
      update: {},
      create: {
        name: 'Oakley',
        description: 'Performance eyewear and sports gear',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { name: 'Warby Parker' },
      update: {},
      create: {
        name: 'Warby Parker',
        description: 'Modern eyewear with a mission',
        isActive: true,
      },
    }),
  ])

  // Create sample products
  const products = [
    {
      name: 'Ray-Ban Aviator Classic',
      description: 'The iconic aviator sunglasses that started it all. Features crystal green lenses and gold-tone metal frame.',
      price: 154.00,
      comparePrice: 180.00,
      sku: 'RB-AVIATOR-001',
      stock: 25,
      images: ['https://images.ray-ban.com/is/image/RayBan/8056596028575_shad_qt.png'],
      isActive: true,
      isFeatured: true,
      categorySlug: 'sunglasses',
      brandName: 'Ray-Ban',
      slug: 'ray-ban-aviator-classic',
      currency: 'USD',
    },
    {
      name: 'Oakley Holbrook',
      description: 'Bold, confident style with O Matter frame material and Plutonite lenses that block 100% of UV rays.',
      price: 162.00,
      comparePrice: 190.00,
      sku: 'OK-HOLBROOK-001',
      stock: 15,
      images: ['https://www.oakley.com/dw/image/v2/AAJX_PRD/on/demandware.static/-/Sites-oakley-master-catalog/default/dw12345678/images/large/OKL-9202-001.jpg'],
      isActive: true,
      isFeatured: true,
      categorySlug: 'sunglasses',
      brandName: 'Oakley',
      slug: 'oakley-holbrook',
      currency: 'USD',
    },
    {
      name: 'Warby Parker Winston',
      description: 'Classic acetate frames with a modern twist. Perfect for both work and play.',
      price: 95.00,
      comparePrice: 120.00,
      sku: 'WP-WINSTON-001',
      stock: 30,
      images: ['https://www.warbyparker.com/images/eyeglasses/winston/black/1.jpg'],
      isActive: true,
      isFeatured: true,
      categorySlug: 'eyeglasses',
      brandName: 'Warby Parker',
      slug: 'warby-parker-winston',
      currency: 'USD',
    },
    {
      name: 'Ray-Ban Wayfarer Classic',
      description: 'The timeless Wayfarer design with crystal green lenses and black acetate frame.',
      price: 134.00,
      comparePrice: 160.00,
      sku: 'RB-WAYFARER-001',
      stock: 20,
      images: ['https://images.ray-ban.com/is/image/RayBan/8056596028575_shad_qt.png'],
      isActive: true,
      isFeatured: false,
      categorySlug: 'sunglasses',
      brandName: 'Ray-Ban',
      slug: 'ray-ban-wayfarer-classic',
      currency: 'USD',
    },
    {
      name: 'Oakley Flak 2.0',
      description: 'High-performance sunglasses designed for athletes. Features HDO technology and O Matter frame.',
      price: 184.00,
      comparePrice: 220.00,
      sku: 'OK-FLAK2-001',
      stock: 12,
      images: ['https://www.oakley.com/dw/image/v2/AAJX_PRD/on/demandware.static/-/Sites-oakley-master-catalog/default/dw12345678/images/large/OKL-9202-001.jpg'],
      isActive: true,
      isFeatured: false,
      categorySlug: 'sunglasses',
      brandName: 'Oakley',
      slug: 'oakley-flak-2-0',
      currency: 'USD',
    },
    {
      name: 'Warby Parker Finch',
      description: 'Lightweight titanium frames with a minimalist design. Perfect for everyday wear.',
      price: 125.00,
      comparePrice: 150.00,
      sku: 'WP-FINCH-001',
      stock: 18,
      images: ['https://www.warbyparker.com/images/eyeglasses/finch/black/1.jpg'],
      isActive: true,
      isFeatured: false,
      categorySlug: 'eyeglasses',
      brandName: 'Warby Parker',
      slug: 'warby-parker-finch',
      currency: 'USD',
    },
  ]

  for (const productData of products) {
    const category = categories.find(c => c.slug === productData.categorySlug)
    const brand = brands.find(b => b.name === productData.brandName)

    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        comparePrice: productData.comparePrice,
        sku: productData.sku,
        stock: productData.stock,
        images: productData.images,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        slug: productData.slug,
        currency: productData.currency,
        categoryId: category!.id,
        brandId: brand!.id,
      },
    })
  }

  console.log('✅ Sample products seeded successfully!')
  console.log(`📊 Created ${categories.length} categories`)
  console.log(`🏷️  Created ${brands.length} brands`)
  console.log(`🕶️  Created ${products.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding products:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
