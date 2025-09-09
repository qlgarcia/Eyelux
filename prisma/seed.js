const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create main categories
  const eyeglasses = await prisma.category.upsert({
    where: { name: 'Eyeglasses' },
    update: {},
    create: {
      name: 'Eyeglasses',
      description: 'Stylish eyeglasses for everyday wear',
      slug: 'eyeglasses',
      image: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  const sunglasses = await prisma.category.upsert({
    where: { name: 'Sunglasses' },
    update: {},
    create: {
      name: 'Sunglasses',
      description: 'Protective and fashionable sunglasses',
      slug: 'sunglasses',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  const blueLightGlasses = await prisma.category.upsert({
    where: { name: 'Blue-Light Glasses' },
    update: {},
    create: {
      name: 'Blue-Light Glasses',
      description: 'Glasses that protect your eyes from blue light',
      slug: 'blue-light-glasses',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  // Create subcategories for Eyeglasses
  const metalFrames = await prisma.category.upsert({
    where: { name: 'Metal Frames' },
    update: {},
    create: {
      name: 'Metal Frames',
      description: 'Durable and lightweight metal frame eyeglasses',
      slug: 'metal-frames',
      parentId: eyeglasses.id,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  const acetateFrames = await prisma.category.upsert({
    where: { name: 'Acetate Frames' },
    update: {},
    create: {
      name: 'Acetate Frames',
      description: 'Classic and stylish acetate frame eyeglasses',
      slug: 'acetate-frames',
      parentId: eyeglasses.id,
      image: 'https://images.unsplash.com/photo-1596466596120-2a8e4b5d1a51?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  const lightweightFrames = await prisma.category.upsert({
    where: { name: 'Lightweight Frames' },
    update: {},
    create: {
      name: 'Lightweight Frames',
      description: 'Ultra-lightweight eyeglasses for all-day comfort',
      slug: 'lightweight-frames',
      parentId: eyeglasses.id,
      image: 'https://images.unsplash.com/photo-1621072153629-6a5f5b5f1e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  // Create subcategories for Sunglasses
  const polarized = await prisma.category.upsert({
    where: { name: 'Polarized' },
    update: {},
    create: {
      name: 'Polarized',
      description: 'Sunglasses with polarized lenses for reduced glare',
      slug: 'polarized',
      parentId: sunglasses.id,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  const sportsSunglasses = await prisma.category.upsert({
    where: { name: 'Sports Sunglasses' },
    update: {},
    create: {
      name: 'Sports Sunglasses',
      description: 'Durable sunglasses designed for active lifestyles',
      slug: 'sports-sunglasses',
      parentId: sunglasses.id,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  const fashionSunglasses = await prisma.category.upsert({
    where: { name: 'Fashion Sunglasses' },
    update: {},
    create: {
      name: 'Fashion Sunglasses',
      description: 'Trendy and stylish sunglasses for fashion-forward individuals',
      slug: 'fashion-sunglasses',
      parentId: sunglasses.id,
      image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  // Create subcategories for Blue-Light Glasses
  const kidsBlueLight = await prisma.category.upsert({
    where: { name: 'Kids' },
    update: {},
    create: {
      name: 'Kids',
      description: 'Blue-light glasses designed for children',
      slug: 'kids-blue-light',
      parentId: blueLightGlasses.id,
      image: 'https://images.unsplash.com/photo-1622630998477-20aa2b5d486d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  const teensBlueLight = await prisma.category.upsert({
    where: { name: 'Teens' },
    update: {},
    create: {
      name: 'Teens',
      description: 'Blue-light glasses designed for teenagers',
      slug: 'teens-blue-light',
      parentId: blueLightGlasses.id,
      image: 'https://images.unsplash.com/photo-1592389102485-a3bc756c5a39?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  const adultsBlueLight = await prisma.category.upsert({
    where: { name: 'Adults' },
    update: {},
    create: {
      name: 'Adults',
      description: 'Blue-light glasses designed for adults',
      slug: 'adults-blue-light',
      parentId: blueLightGlasses.id,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  });

  // Create products for Metal Frames
  await prisma.product.createMany({
    data: [
      {
        name: 'eyeLUX TitanFlex Round',
        description: 'Lightweight titanium frames with flexible hinges for all-day comfort.',
        price: 189.99,
        sku: 'EL-MF-001',
        categoryId: metalFrames.id,
        stockQuantity: 25,
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1591070774273-e5285fabe6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        isFeatured: true,
        specifications: {
          material: 'Titanium',
          frameType: 'Full Rim',
          lensWidth: 50,
          bridgeWidth: 18,
          templeLength: 145,
          colors: ['Silver', 'Black', 'Gold']
        }
      },
      {
        name: 'Classic ThinWire Oval',
        description: 'Timeless thin wire oval frames with a vintage-inspired design.',
        price: 159.99,
        sku: 'EL-MF-002',
        categoryId: metalFrames.id,
        stockQuantity: 30,
        image: 'https://images.unsplash.com/photo-1591070774273-e5285fabe6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1591070774273-e5285fabe6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        specifications: {
          material: 'Stainless Steel',
          frameType: 'Full Rim',
          lensWidth: 48,
          bridgeWidth: 19,
          templeLength: 140,
          colors: ['Silver', 'Gold', 'Rose Gold']
        }
      },
      {
        name: 'Urban Chrome Rectangle',
        description: 'Modern rectangular frames with a sleek chrome finish for urban professionals.',
        price: 179.99,
        sku: 'EL-MF-003',
        categoryId: metalFrames.id,
        stockQuantity: 20,
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        specifications: {
          material: 'Stainless Steel',
          frameType: 'Full Rim',
          lensWidth: 52,
          bridgeWidth: 18,
          templeLength: 145,
          colors: ['Chrome', 'Black']
        }
      },
      {
        name: 'FlexiBridge Semi-Rimless',
        description: 'Semi-rimless design with a flexible bridge for enhanced comfort.',
        price: 199.99,
        sku: 'EL-MF-004',
        categoryId: metalFrames.id,
        stockQuantity: 15,
        image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1556306535-0f09a537f0c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        specifications: {
          material: 'Titanium',
          frameType: 'Semi-Rimless',
          lensWidth: 54,
          bridgeWidth: 20,
          templeLength: 150,
          colors: ['Silver', 'Gunmetal']
        }
      },
      {
        name: 'Silver Minimalist Hex',
        description: 'Minimalist hexagonal frames in polished silver for a contemporary look.',
        price: 169.99,
        sku: 'EL-MF-005',
        categoryId: metalFrames.id,
        stockQuantity: 22,
        image: 'https://images.unsplash.com/photo-1556306535-38febf678080?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1556306535-38febf678080?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        specifications: {
          material: 'Stainless Steel',
          frameType: 'Full Rim',
          lensWidth: 51,
          bridgeWidth: 17,
          templeLength: 142,
          colors: ['Silver']
        }
      }
    ]
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
