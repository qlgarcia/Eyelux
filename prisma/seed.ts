import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Temporarily disable foreign key checks to delete categories with self-references
  await prisma.$executeRawUnsafe('SET foreign_key_checks = 0;');
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.$executeRawUnsafe('SET foreign_key_checks = 1;');
  
  console.log('🗑️ Cleared existing data');

  // Create main categories
  const eyeglasses = await prisma.category.upsert({
    where: { name: 'Eyeglasses' },
    update: {},
    create: {
      name: 'Eyeglasses',
      slug: 'eyeglasses',
      description: 'Stylish eyeglasses for everyday wear',
    },
  });

  const sunglasses = await prisma.category.upsert({
    where: { name: 'Sunglasses' },
    update: {},
    create: {
      name: 'Sunglasses',
      slug: 'sunglasses',
      description: 'Protective and fashionable sunglasses',
    },
  });

  const contactLenses = await prisma.category.upsert({
    where: { name: 'Contact Lenses' },
    update: {},
    create: {
      name: 'Contact Lenses',
      slug: 'contact-lenses',
      description: 'Experience clear vision with our comfortable contact lenses',
    },
  });

  // Eyeglasses Sub-categories
  const metalFrames = await prisma.category.upsert({ where: { name: 'Metal Frames' }, update: {}, create: { name: 'Metal Frames', slug: 'metal-frames', parentId: eyeglasses.id } });
  const acetateFrames = await prisma.category.upsert({ where: { name: 'Acetate Frames' }, update: {}, create: { name: 'Acetate Frames', slug: 'acetate-frames', parentId: eyeglasses.id } });
  const lightweightFrames = await prisma.category.upsert({ where: { name: 'Lightweight Frames' }, update: {}, create: { name: 'Lightweight Frames', slug: 'lightweight-frames', parentId: eyeglasses.id } });

  // Sunglasses Sub-categories
  const polarized = await prisma.category.upsert({ where: { name: 'Polarized' }, update: {}, create: { name: 'Polarized', slug: 'polarized', parentId: sunglasses.id } });
  const sportsSunglasses = await prisma.category.upsert({ where: { name: 'Sports Sunglasses' }, update: {}, create: { name: 'Sports Sunglasses', slug: 'sports-sunglasses', parentId: sunglasses.id } });
  const fashionSunglasses = await prisma.category.upsert({ where: { name: 'Fashion Sunglasses' }, update: {}, create: { name: 'Fashion Sunglasses', slug: 'fashion-sunglasses', parentId: sunglasses.id } });

  console.log('✅ Categories created');

  const products = [
    // Eyeglasses - Metal Frames
    { name: 'eyeLUX TitanFlex Round', categoryId: metalFrames.id, images: [] },
    { name: 'Classic ThinWire Oval', categoryId: metalFrames.id, images: [] },
    { name: 'Urban Chrome Rectangle', categoryId: metalFrames.id, images: [] },
    { name: 'FlexiBridge Semi-Rimless', categoryId: metalFrames.id, images: [] },
    { name: 'Silver Minimalist Hex', categoryId: metalFrames.id, images: [] },

    // Eyeglasses - Acetate Frames
    { name: 'Vintage Havana Cat Eye', categoryId: acetateFrames.id, images: [] },
    { name: 'Urban Tortoise Shell Square', categoryId: acetateFrames.id, images: [] },
    { name: 'ClearFlex Transparent Round', categoryId: acetateFrames.id, images: [] },
    { name: 'Matte Noir Bold Rectangle', categoryId: acetateFrames.id, images: [] },
    { name: 'Frosted Glacier Oval', categoryId: acetateFrames.id, images: [] },

    // Eyeglasses - Lightweight Frames
    { name: 'Ultralite FeatherFrame', categoryId: lightweightFrames.id, images: [] },
    { name: 'CarbonLite Oval', categoryId: lightweightFrames.id, images: [] },
    { name: 'Aero Slim Rectangle', categoryId: lightweightFrames.id, images: [] },
    { name: 'BreezeFrame Semi-Rimless', categoryId: lightweightFrames.id, images: [] },
    { name: 'AirVision Clip-On', categoryId: lightweightFrames.id, images: [] },

    // Sunglasses - Polarized
    { name: 'Cruise Black Polar', categoryId: polarized.id, images: [] },
    { name: 'BeachView Brown Tint', categoryId: polarized.id, images: [] },
    { name: 'MirrorFlex Gradient Blue', categoryId: polarized.id, images: [] },
    { name: 'Anti-Glare Gold Aviators', categoryId: polarized.id, images: [] },
    { name: 'UVMax Jet Grey', categoryId: polarized.id, images: [] },

    // Sunglasses - Sports Sunglasses
    { name: 'ProRun Active Wrap', categoryId: sportsSunglasses.id, images: [] },
    { name: 'BikeGuard Windproof', categoryId: sportsSunglasses.id, images: [] },
    { name: 'TrailBlaze Red Lens', categoryId: sportsSunglasses.id, images: [] },
    { name: 'UVSecure Full Shield', categoryId: sportsSunglasses.id, images: [] },
    { name: 'AquaSport Floating Shades', categoryId: sportsSunglasses.id, images: [] },

    // Sunglasses - Fashion Sunglasses
    { name: 'Diva Oversized Black', categoryId: fashionSunglasses.id, images: [] },
    { name: 'RetroPop Yellow Lens', categoryId: fashionSunglasses.id, images: ['https://www.amazon.com/ShadyVEU-Plastic-Trendy-Sunglasses-Blockers/dp/B09T5MXCF3'] },
    { name: 'Mirror Luxe Aviator', categoryId: fashionSunglasses.id, images: ['https://www.cosmiceyewear.com/products/luxe-58mm-color-mirror-aviator-sunglasses'] },
    { name: 'Glossy Rose Pink Square', categoryId: fashionSunglasses.id, images: ['https://www.gucci.com/us/en/pr/women/accessories-for-women/eyewear-for-women/sunglasses-for-women/square-rectangle-sunglasses-for-women/square-frame-sunglasses-p-832409J16915660'] },
    { name: 'PastelHue Transparent Cat Eye', categoryId: fashionSunglasses.id, images: ['https://www.amazon.com/Spacelab-Translucent-Cat-Sunglasses-Pink/dp/B0979L6W6B'] },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        slug: product.name.toLowerCase().replace(/ /g, '-'),
        description: `Description for ${product.name}`,
        price: Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
        stock: Math.floor(Math.random() * 100),
      },
    });
  }

  console.log('✅ Products created');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
