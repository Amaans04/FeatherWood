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
import { db } from "./db";
import { eq, and, ilike, or, between, desc, sql } from "drizzle-orm";

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
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  filterProducts(filters: { categoryId?: number, minPrice?: number, maxPrice?: number, material?: string }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Interior project methods
  getAllProjects(): Promise<InteriorProject[]>;
  getProjectById(id: number): Promise<InteriorProject | undefined>;
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

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product category methods
  async getAllCategories(): Promise<ProductCategory[]> {
    return await db.select().from(productCategories);
  }

  async getCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
    const [category] = await db.select().from(productCategories).where(eq(productCategories.slug, slug));
    return category;
  }

  async createCategory(insertCategory: InsertProductCategory): Promise<ProductCategory> {
    const [category] = await db.insert(productCategories).values(insertCategory).returning();
    return category;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isFeatured, true)).limit(6);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db.select().from(products).where(
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`)
      )
    );
  }

  async filterProducts(filters: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    material?: string;
  }): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (filters.categoryId) {
      query = query.where(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      query = query.where(between(products.price, filters.minPrice, filters.maxPrice));
    } else if (filters.minPrice !== undefined) {
      query = query.where(sql`${products.price} >= ${filters.minPrice}`);
    } else if (filters.maxPrice !== undefined) {
      query = query.where(sql`${products.price} <= ${filters.maxPrice}`);
    }
    
    if (filters.material) {
      query = query.where(eq(products.material, filters.material));
    }
    
    return await query;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Interior project methods
  async getAllProjects(): Promise<InteriorProject[]> {
    return await db.select().from(interiorProjects);
  }

  async getProjectById(id: number): Promise<InteriorProject | undefined> {
    const [project] = await db.select().from(interiorProjects).where(eq(interiorProjects.id, id));
    return project;
  }

  async getProjectBySlug(slug: string): Promise<InteriorProject | undefined> {
    const [project] = await db.select().from(interiorProjects).where(eq(interiorProjects.slug, slug));
    return project;
  }

  async getProjectsByCategory(category: string): Promise<InteriorProject[]> {
    return await db.select().from(interiorProjects).where(eq(interiorProjects.category, category));
  }

  async getFeaturedProjects(): Promise<InteriorProject[]> {
    return await db.select().from(interiorProjects).where(eq(interiorProjects.isFeatured, true)).limit(6);
  }

  async createProject(insertProject: InsertInteriorProject): Promise<InteriorProject> {
    const [project] = await db.insert(interiorProjects).values(insertProject).returning();
    return project;
  }

  // Blog post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishDate));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getRecentBlogPosts(limit: number): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishDate)).limit(limit);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  // Consultation request methods
  async createConsultationRequest(insertRequest: InsertConsultationRequest): Promise<ConsultationRequest> {
    const [request] = await db.insert(consultationRequests).values(insertRequest).returning();
    return request;
  }

  async getAllConsultationRequests(): Promise<ConsultationRequest[]> {
    return await db.select().from(consultationRequests).orderBy(desc(consultationRequests.createdAt));
  }

  // Cart methods
  async getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]> {
    if (userId) {
      return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    } else if (sessionId) {
      return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
    return [];
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    let existingItems: CartItem[] = [];
    if (insertItem.userId) {
      existingItems = await db.select().from(cartItems).where(
        and(
          eq(cartItems.userId, insertItem.userId),
          eq(cartItems.productId, insertItem.productId)
        )
      );
    } else if (insertItem.sessionId) {
      existingItems = await db.select().from(cartItems).where(
        and(
          eq(cartItems.sessionId, insertItem.sessionId),
          eq(cartItems.productId, insertItem.productId)
        )
      );
    }
    
    // If item exists, update quantity
    if (existingItems.length > 0) {
      const existingItem = existingItems[0];
      const newQuantity = (existingItem.quantity || 1) + (insertItem.quantity || 1);
      const [updatedItem] = await db.update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }
    
    // Otherwise insert new item
    const itemToInsert = {
      ...insertItem,
      quantity: insertItem.quantity || 1
    };
    const [cartItem] = await db.insert(cartItems).values(itemToInsert).returning();
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }

  async clearCart(userId?: number, sessionId?: string): Promise<boolean> {
    if (userId) {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
      return true;
    } else if (sessionId) {
      await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
      return true;
    }
    return false;
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    return await db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists in wishlist
    const existingItems = await db.select().from(wishlistItems).where(
      and(
        eq(wishlistItems.userId, insertItem.userId),
        eq(wishlistItems.productId, insertItem.productId)
      )
    );
    
    // If item exists, return it
    if (existingItems.length > 0) {
      return existingItems[0];
    }
    
    // Otherwise insert new item
    const [wishlistItem] = await db.insert(wishlistItems).values(insertItem).returning();
    return wishlistItem;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    await db.delete(wishlistItems).where(
      and(
        eq(wishlistItems.userId, userId),
        eq(wishlistItems.productId, productId)
      )
    );
    return true;
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const items = await db.select().from(wishlistItems).where(
      and(
        eq(wishlistItems.userId, userId),
        eq(wishlistItems.productId, productId)
      )
    );
    return items.length > 0;
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getFeaturedTestimonials(limit: number): Promise<Testimonial[]> {
    return await db.select()
      .from(testimonials)
      .orderBy(desc(testimonials.displayOrder))
      .limit(limit);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }
}

export const storage = new DatabaseStorage();