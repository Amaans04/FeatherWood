import { 
  users, type User, type InsertUser,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  interiorProjects, type InteriorProject, type InsertInteriorProject,
  blogPosts, type BlogPost, type InsertBlogPost,
  consultationRequests, type ConsultationRequest, type InsertConsultationRequest,
  cartItems, type CartItem, type InsertCartItem,
  wishlistItems, type WishlistItem, type InsertWishlistItem, 
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product category methods
  getAllCategories(): Promise<ProductCategory[]>;
  getCategoryBySlug(slug: string): Promise<ProductCategory | undefined>;
  createCategory(category: InsertProductCategory): Promise<ProductCategory>;

  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  filterProducts(filters: { categoryId?: number, minPrice?: number, maxPrice?: number, material?: string }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Interior project methods
  getAllProjects(): Promise<InteriorProject[]>;
  getProjectById(id: string): Promise<InteriorProject | undefined>;
  getProjectBySlug(slug: string): Promise<InteriorProject | undefined>;
  getProjectsByCategory(category: string): Promise<InteriorProject[]>;
  getFeaturedProjects(): Promise<InteriorProject[]>;
  createProject(project: InsertInteriorProject): Promise<InteriorProject>;

  // Blog post methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getRecentBlogPosts(limit: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Consultation request methods
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
  getAllConsultationRequests(): Promise<ConsultationRequest[]>;

  // Cart methods
  getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId?: number, sessionId?: string): Promise<boolean>;

  // Wishlist methods
  getWishlistItems(userId: number): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;

  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(limit: number): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, ProductCategory>;
  private products: Map<string, Product>;
  private projects: Map<string, InteriorProject>;
  private blogPosts: Map<number, BlogPost>;
  private consultationRequests: Map<number, ConsultationRequest>;
  private cartItems: Map<number, CartItem>;
  private wishlistItems: Map<number, WishlistItem>;
  private testimonials: Map<number, Testimonial>;

  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentProjectId: number;
  private currentBlogPostId: number;
  private currentConsultationRequestId: number;
  private currentCartItemId: number;
  private currentWishlistItemId: number;
  private currentTestimonialId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map<string, Product>(); // Changed to string key for products
    this.projects = new Map<string, InteriorProject>(); // Changed to string key for projects
    this.blogPosts = new Map();
    this.consultationRequests = new Map();
    this.cartItems = new Map();
    this.wishlistItems = new Map();
    this.testimonials = new Map();

    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentProjectId = 1;
    this.currentBlogPostId = 1;
    this.currentConsultationRequestId = 1;
    this.currentCartItemId = 1;
    this.currentWishlistItemId = 1;
    this.currentTestimonialId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // Initialize sample data
  private async initializeData() {
    // Use the imported fs and path modules
    
    // Add categories
    const categories = [
      { name: 'Living Room', slug: 'living-room', description: 'Furniture for your living spaces', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc' },
      { name: 'Bedroom', slug: 'bedroom', description: 'Comfortable beds and bedroom furniture', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85' },
      { name: 'Dining Room', slug: 'dining-room', description: 'Elegant dining tables and chairs', imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267' },
      { name: 'Kitchen', slug: 'kitchen', description: 'Modern kitchen furniture and accessories', imageUrl: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7' },
      { name: 'Office', slug: 'office', description: 'Productive workspace furniture', imageUrl: 'https://images.unsplash.com/photo-1516397281156-3c1ddf2388c5' }
    ];

    for (const category of categories) {
      await this.createCategory(category as InsertProductCategory);
    }

    // Load products from JSON file
    try {
      const productsFilePath = path.resolve(__dirname, 'data/furnitureProducts.json');
      if (fs.existsSync(productsFilePath)) {
        const furnitureProductsData = fs.readFileSync(productsFilePath, 'utf8');
        const furnitureProducts = JSON.parse(furnitureProductsData);
        
        for (const product of furnitureProducts) {
          this.products.set(product.id, product as Product);
        }
        
        console.log(`Loaded ${furnitureProducts.length} furniture products from JSON`);
      } else {
        console.log('Furniture products JSON file not found, using default data');
        
        // Add default product if JSON file not found
        const defaultProduct = {
          id: "f000",
          title: 'Emerald Velvet Sofa',
          slug: 'emerald-velvet-sofa',
          description: 'A luxurious green velvet sofa with elegant wooden legs.',
          price: 129900, // $1,299.00
          image: 'sofa.jpg',
          category: 'Living Room',
          tags: ['sofa', 'velvet', 'luxury'],
          rating: 45, // 4.5 out of 5
          material: 'Velvet, Wood',
          dimensions: '85"W x 36"D x 33"H',
          color: 'Emerald Green',
          inStock: true,
          isNew: true,
          isFeatured: true,
          imageUrls: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc']
        };
        
        this.products.set(defaultProduct.id, defaultProduct as unknown as Product);
      }
    } catch (error) {
      console.error('Error loading furniture products:', error);
    }
    
    // Load interior projects from JSON file
    try {
      const projectsFilePath = path.resolve(__dirname, 'data/interiorProjects.json');
      if (fs.existsSync(projectsFilePath)) {
        const interiorProjectsData = fs.readFileSync(projectsFilePath, 'utf8');
        const interiorProjects = JSON.parse(interiorProjectsData);
        
        for (const project of interiorProjects) {
          this.projects.set(project.id, project as InteriorProject);
        }
        
        console.log(`Loaded ${interiorProjects.length} interior projects from JSON`);
      } else {
        console.log('Interior projects JSON file not found, using default data');
        
        // Add default project if JSON file not found
        const defaultProject = {
          id: "p000",
          title: 'Contemporary Urban Kitchen',
          slug: 'contemporary-urban-kitchen',
          description: 'A sleek, modern kitchen design with optimized storage and premium appliances for a professional chef.',
          style: 'Modern',
          budget: '12L',
          location: 'Mumbai',
          category: 'Modular Kitchen',
          image: 'kitchen.jpg',
          isFeatured: true,
          imageUrls: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0']
        };
        
        this.projects.set(defaultProject.id, defaultProject as unknown as InteriorProject);
      }
    } catch (error) {
      console.error('Error loading interior projects:', error);
    }

    // Add interior projects
    const projects = [
      {
        title: 'Contemporary Urban Kitchen',
        slug: 'contemporary-urban-kitchen',
        description: 'A sleek, modern kitchen design with optimized storage and premium appliances for a professional chef.',
        category: 'Modular Kitchen',
        imageUrls: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0'],
        isFeatured: true
      },
      {
        title: 'Elegant Family Living Space',
        slug: 'elegant-family-living-space',
        description: 'A harmonious blend of comfort and sophistication created for a family of four in a suburban home.',
        category: 'Living Room',
        imageUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
        isFeatured: true
      },
      {
        title: 'Serene Master Retreat',
        slug: 'serene-master-retreat',
        description: 'A tranquil sanctuary with custom storage solutions and a calming color palette for optimal relaxation.',
        category: 'Bedroom',
        imageUrls: ['https://images.unsplash.com/photo-1560185893-a55cbc8c57e8'],
        isFeatured: true
      }
    ];

    for (const project of projects) {
      await this.createProject(project as InsertInteriorProject);
    }

    // Add blog posts
    const blogPosts = [
      {
        title: '10 Ways to Bring Nature Into Your Living Space',
        slug: '10-ways-to-bring-nature-into-your-living-space',
        content: 'Discover how to incorporate biophilic design elements to create a calming, nature-inspired home environment...',
        excerpt: 'Discover how to incorporate biophilic design elements to create a calming, nature-inspired home environment.',
        category: 'Interior Design',
        imageUrl: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912',
        publishDate: new Date('2023-05-12')
      },
      {
        title: 'Color Psychology in Home Design: What Your Choices Reveal',
        slug: 'color-psychology-in-home-design',
        content: 'Learn how different colors affect mood and perception, and how to use them effectively in your home...',
        excerpt: 'Learn how different colors affect mood and perception, and how to use them effectively in your home.',
        category: 'Color Theory',
        imageUrl: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7',
        publishDate: new Date('2023-04-28')
      },
      {
        title: 'Maximizing Space in Small Kitchens: Design Strategies',
        slug: 'maximizing-space-in-small-kitchens',
        content: 'Smart solutions for creating functional, beautiful kitchens even in limited square footage...',
        excerpt: 'Smart solutions for creating functional, beautiful kitchens even in limited square footage.',
        category: 'Space Planning',
        imageUrl: 'https://images.unsplash.com/photo-1615529328331-f8917597711f',
        publishDate: new Date('2023-04-15')
      }
    ];

    for (const post of blogPosts) {
      await this.createBlogPost(post as InsertBlogPost);
    }

    // Add testimonials
    const testimonials = [
      {
        name: 'Jennifer S.',
        projectType: 'Full Home Design',
        content: 'FeatherWood transformed our living room completely. The designer perfectly captured our style and created a space that exceeds our expectations. The furniture pieces are exquisite and durable.',
        rating: 5,
        initials: 'JS',
        displayOrder: 1
      },
      {
        name: 'Michael R.',
        projectType: 'Kitchen Remodel',
        content: 'The modular kitchen design by FeatherWood is both functional and beautiful. The team was professional, thorough, and delivered on time. The quality of materials and workmanship is outstanding.',
        rating: 5,
        initials: 'MR',
        displayOrder: 2
      },
      {
        name: 'Amanda L.',
        projectType: 'Furniture Customer',
        content: 'We purchased several furniture pieces from FeatherWood for our new home. The quality is exceptional, and their delivery service was prompt and careful. Highly recommend their collection.',
        rating: 45,
        initials: 'AL',
        displayOrder: 3
      }
    ];

    for (const testimonial of testimonials) {
      await this.createTestimonial(testimonial as InsertTestimonial);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName,
      phoneNumber: insertUser.phoneNumber ?? null 
    };
    this.users.set(id, user);
    return user;
  }

  // Product category methods
  async getAllCategories(): Promise<ProductCategory[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertProductCategory): Promise<ProductCategory> {
    const id = this.currentCategoryId++;
    const category: ProductCategory = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    // Use string category name instead of numeric ID
    const category = this.categories.get(categoryId);
    if (!category) return [];
    
    return Array.from(this.products.values()).filter(
      (product) => product.category === category.name,
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured,
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.title.toLowerCase().includes(lowerQuery) || 
        product.description.toLowerCase().includes(lowerQuery)
    );
  }

  async filterProducts(filters: { 
    categoryId?: number, 
    minPrice?: number, 
    maxPrice?: number, 
    material?: string 
  }): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => {
      // Use category name from category id
      if (filters.categoryId) {
        const category = this.categories.get(filters.categoryId);
        if (category && product.category !== category.name) return false;
      }
      
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      if (filters.material && (!product.material || !product.material.toLowerCase().includes(filters.material.toLowerCase()))) return false;
      return true;
    });
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    // For new products, create an ID like "f" + next number
    const id = `f${this.currentProductId++}`;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Interior project methods
  async getAllProjects(): Promise<InteriorProject[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: string): Promise<InteriorProject | undefined> {
    return this.projects.get(id);
  }

  async getProjectBySlug(slug: string): Promise<InteriorProject | undefined> {
    return Array.from(this.projects.values()).find(
      (project) => project.slug === slug,
    );
  }

  async getProjectsByCategory(category: string): Promise<InteriorProject[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.category === category,
    );
  }

  async getFeaturedProjects(): Promise<InteriorProject[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.isFeatured,
    );
  }

  async createProject(insertProject: InsertInteriorProject): Promise<InteriorProject> {
    // For new projects, create an ID like "p" + next number
    const id = `p${this.currentProjectId++}`;
    const project: InteriorProject = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // Blog post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug,
    );
  }

  async getRecentBlogPosts(limit: number): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const post: BlogPost = { ...insertPost, id };
    this.blogPosts.set(id, post);
    return post;
  }

  // Consultation request methods
  async createConsultationRequest(insertRequest: InsertConsultationRequest): Promise<ConsultationRequest> {
    const id = this.currentConsultationRequestId++;
    const request: ConsultationRequest = { ...insertRequest, id };
    this.consultationRequests.set(id, request);
    return request;
  }

  async getAllConsultationRequests(): Promise<ConsultationRequest[]> {
    return Array.from(this.consultationRequests.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Cart methods
  async getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => 
        (userId && item.userId === userId) || 
        (sessionId && item.sessionId === sessionId)
    );
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => 
        (insertItem.userId && item.userId === insertItem.userId && item.productId === insertItem.productId) ||
        (insertItem.sessionId && item.sessionId === insertItem.sessionId && item.productId === insertItem.productId)
    );

    if (existingItem) {
      // Update quantity instead of adding a new item
      existingItem.quantity += insertItem.quantity || 1;
      return existingItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { ...insertItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.quantity = quantity;
      return cartItem;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId?: number, sessionId?: string): Promise<boolean> {
    const cartItemsToRemove = Array.from(this.cartItems.values())
      .filter(item => 
        (userId && item.userId === userId) || 
        (sessionId && item.sessionId === sessionId)
      );
    
    for (const item of cartItemsToRemove) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(
      (item) => item.userId === userId
    );
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if the item already exists in the wishlist
    const existingItem = Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === insertItem.userId && item.productId === insertItem.productId
    );

    if (existingItem) {
      return existingItem;
    }

    const id = this.currentWishlistItemId++;
    const wishlistItem: WishlistItem = { ...insertItem, id };
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const item = Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
    
    if (item) {
      return this.wishlistItems.delete(item.id);
    }
    
    return false;
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    return !!Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).sort((a, b) => 
      (a.displayOrder || 0) - (b.displayOrder || 0)
    );
  }

  async getFeaturedTestimonials(limit: number): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .slice(0, limit);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
