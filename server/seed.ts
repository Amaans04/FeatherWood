import { db } from './db';
import {
  productCategories, products, interiorProjects, blogPosts, testimonials
} from '@shared/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await db.delete(testimonials);
  await db.delete(blogPosts);
  await db.delete(interiorProjects);
  await db.delete(products);
  await db.delete(productCategories);

  console.log('Cleared existing data');

  // Seed product categories
  const furnitureCategory = await db.insert(productCategories).values({
    name: 'Furniture',
    slug: 'furniture',
    description: 'Elegant and functional furniture pieces',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3'
  }).returning();

  const lightingCategory = await db.insert(productCategories).values({
    name: 'Lighting',
    slug: 'lighting',
    description: 'Modern lighting solutions for your home',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3'
  }).returning();

  const decorCategory = await db.insert(productCategories).values({
    name: 'Decor',
    slug: 'decor',
    description: 'Stylish decor items to enhance your space',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3'
  }).returning();

  console.log('Seeded product categories');

  // Seed products
  await db.insert(products).values([
    {
      name: 'Emerald Velvet Sofa',
      slug: 'emerald-velvet-sofa',
      description: 'Luxurious emerald velvet sofa with gold-finished legs',
      price: 1299.99,
      categoryId: furnitureCategory[0].id,
      material: 'Velvet',
      color: 'Emerald',
      dimensions: '220x85x75 cm',
      weight: 45,
      isFeatured: true,
      isNew: true,
      rating: 4.8,
      stock: 10,
      salePrice: null,
      imageUrls: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3'
      ]
    },
    {
      name: 'Marble Coffee Table',
      slug: 'marble-coffee-table',
      description: 'Elegant coffee table with marble top and gold base',
      price: 699.99,
      categoryId: furnitureCategory[0].id,
      material: 'Marble, Metal',
      color: 'White, Gold',
      dimensions: '120x60x45 cm',
      weight: 30,
      isFeatured: true,
      isNew: false,
      rating: 4.5,
      stock: 8,
      salePrice: 599.99,
      imageUrls: [
        'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3'
      ]
    },
    {
      name: 'Modern Brass Pendant Light',
      slug: 'modern-brass-pendant-light',
      description: 'Sleek brass pendant light for dining areas and entryways',
      price: 249.99,
      categoryId: lightingCategory[0].id,
      material: 'Brass',
      color: 'Gold',
      dimensions: '30x30x45 cm',
      weight: 3,
      isFeatured: true,
      isNew: true,
      rating: 4.7,
      stock: 15,
      salePrice: null,
      imageUrls: [
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3'
      ]
    },
    {
      name: 'Abstract Wall Art',
      slug: 'abstract-wall-art',
      description: 'Contemporary abstract wall art in black and gold tones',
      price: 159.99,
      categoryId: decorCategory[0].id,
      material: 'Canvas, Wood',
      color: 'Black, Gold',
      dimensions: '80x120 cm',
      weight: 2,
      isFeatured: true,
      isNew: false,
      rating: 4.6,
      stock: 20,
      salePrice: null,
      imageUrls: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1577083288073-40892c0860a4?ixlib=rb-4.0.3'
      ]
    },
    {
      name: 'Leather Lounge Chair',
      slug: 'leather-lounge-chair',
      description: 'Premium leather lounge chair with ottoman',
      price: 899.99,
      categoryId: furnitureCategory[0].id,
      material: 'Leather, Wood',
      color: 'Brown',
      dimensions: '85x75x100 cm',
      weight: 25,
      isFeatured: true,
      isNew: false,
      rating: 4.9,
      stock: 5,
      salePrice: null,
      imageUrls: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1581782530033-c5653e953cf5?ixlib=rb-4.0.3'
      ]
    },
    {
      name: 'Crystal Table Lamp',
      slug: 'crystal-table-lamp',
      description: 'Elegant crystal table lamp with fabric shade',
      price: 189.99,
      categoryId: lightingCategory[0].id,
      material: 'Crystal, Fabric',
      color: 'Clear, White',
      dimensions: '30x30x60 cm',
      weight: 3,
      isFeatured: true,
      isNew: true,
      rating: 4.4,
      stock: 12,
      salePrice: 159.99,
      imageUrls: [
        'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1567459169668-95d355371bda?ixlib=rb-4.0.3'
      ]
    }
  ]);

  console.log('Seeded products');

  // Seed interior projects
  await db.insert(interiorProjects).values([
    {
      title: 'Contemporary Urban Kitchen',
      slug: 'contemporary-urban-kitchen',
      description: 'A sleek and functional kitchen design for a downtown apartment.',
      category: 'Kitchen',
      isFeatured: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1588854337236-6889d631faa8?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3'
      ]
    },
    {
      title: 'Luxury Master Bedroom',
      slug: 'luxury-master-bedroom',
      description: 'An elegant master bedroom with custom headboard and premium furnishings.',
      category: 'Bedroom',
      isFeatured: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3'
      ]
    },
    {
      title: 'Minimalist Living Space',
      slug: 'minimalist-living-space',
      description: 'A clean and open living room design with thoughtfully selected furniture pieces.',
      category: 'Living Room',
      isFeatured: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-4.0.3'
      ]
    },
    {
      title: 'Executive Home Office',
      slug: 'executive-home-office',
      description: 'A sophisticated home office designed for productivity and comfort.',
      category: 'Office',
      isFeatured: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1486946255434-2466348c2166?ixlib=rb-4.0.3'
      ]
    },
    {
      title: 'Spa-Inspired Bathroom',
      slug: 'spa-inspired-bathroom',
      description: 'A luxurious bathroom retreat with modern fixtures and natural materials.',
      category: 'Bathroom',
      isFeatured: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3'
      ]
    },
    {
      title: 'Modern Dining Experience',
      slug: 'modern-dining-experience',
      description: 'A contemporary dining area designed for entertaining and everyday dining.',
      category: 'Dining',
      isFeatured: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1595514535310-e4e66107c31d?ixlib=rb-4.0.3'
      ]
    }
  ]);

  console.log('Seeded interior projects');

  // Seed blog posts
  await db.insert(blogPosts).values([
    {
      title: '10 Ways to Bring Nature Into Your Living Space',
      slug: '10-ways-to-bring-nature-into-your-living-space',
      content: 'Bringing natural elements into your home can create a more calming, balanced environment...',
      category: 'Interior Design',
      publishDate: new Date('2024-02-15'),
      imageUrl: 'https://images.unsplash.com/photo-1594292562756-26f28e678d44?ixlib=rb-4.0.3',
      excerpt: 'Discover how to incorporate natural elements for a more peaceful home environment.'
    },
    {
      title: 'The Psychology of Color in Interior Design',
      slug: 'psychology-of-color-in-interior-design',
      content: 'Colors can significantly impact our mood, productivity, and overall well-being...',
      category: 'Design Tips',
      publishDate: new Date('2024-01-28'),
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3',
      excerpt: 'Learn how different colors affect your mood and which ones to choose for each room.'
    },
    {
      title: 'Small Space Solutions: Maximizing Your Square Footage',
      slug: 'small-space-solutions',
      content: 'Living in a compact space does not mean sacrificing style or functionality...',
      category: 'Space Planning',
      publishDate: new Date('2024-01-10'),
      imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3',
      excerpt: 'Smart design solutions to make the most of limited square footage.'
    },
    {
      title: 'Luxury on a Budget: High-End Looks for Less',
      slug: 'luxury-on-a-budget',
      content: 'Achieving a luxurious interior does not always require a premium budget...',
      category: 'Budget Design',
      publishDate: new Date('2023-12-20'),
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0c2?ixlib=rb-4.0.3',
      excerpt: 'How to create a high-end look in your home without breaking the bank.'
    }
  ]);

  console.log('Seeded blog posts');

  // Seed testimonials
  await db.insert(testimonials).values([
    {
      name: 'Jennifer S.',
      content: 'Working with FeatherWood transformed our house into the elegant home we always envisioned. Their attention to detail and commitment to quality exceeded our expectations.',
      rating: 5,
      projectType: 'Full Home Design',
      initials: 'JS',
      displayOrder: 1
    },
    {
      name: 'Michael R.',
      content: 'The team at FeatherWood helped us redesign our living room and kitchen. The result is not only beautiful but perfectly functional for our family needs.',
      rating: 5,
      projectType: 'Living Room & Kitchen',
      initials: 'MR',
      displayOrder: 2
    },
    {
      name: 'Sarah L.',
      content: 'I ordered several furniture pieces and could not be happier with the quality. The delivery was prompt and the installation team was professional and efficient.',
      rating: 4,
      projectType: 'Furniture Purchase',
      initials: 'SL',
      displayOrder: 3
    },
    {
      name: 'David W.',
      content: 'Our master bedroom redesign exceeded all expectations. The designer truly understood our vision and executed it flawlessly.',
      rating: 5,
      projectType: 'Bedroom Design',
      initials: 'DW',
      displayOrder: 4
    }
  ]);

  console.log('Seeded testimonials');

  console.log('✅ Database seeding complete!');
}

seed()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Closing database connection');
    await pool.end();
    process.exit(0);
  });