import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phoneNumber: true,
});

// Product categories schema
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const insertProductCategorySchema = createInsertSchema(productCategories).pick({
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
});

// Products schema
export const products = pgTable("products", {
  id: text("id").primaryKey(), // Using string IDs like "f001"
  title: text("title").notNull(),
  price: integer("price").notNull(), // Price in cents
  image: text("image").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  description: text("description").notNull(),
  // Keep compatibility with existing fields
  slug: text("slug").notNull().unique(),
  salePrice: integer("sale_price"),
  rating: integer("rating"),
  material: text("material"),
  dimensions: text("dimensions"),
  color: text("color"),
  inStock: boolean("in_stock").notNull().default(true),
  isNew: boolean("is_new").default(false),
  isFeatured: boolean("is_featured").default(false),
  imageUrls: text("image_urls").array(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  id: true,
  title: true,
  price: true,
  image: true,
  category: true,
  tags: true,
  description: true,
  slug: true,
  salePrice: true,
  rating: true,
  material: true,
  dimensions: true,
  color: true,
  inStock: true,
  isNew: true,
  isFeatured: true,
  imageUrls: true,
});

// Interior projects schema
export const interiorProjects = pgTable("interior_projects", {
  id: text("id").primaryKey(), // Using string IDs like "p002"
  title: text("title").notNull(),
  style: text("style").notNull(),  
  budget: text("budget").notNull(),
  location: text("location").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  // Keep compatibility with existing fields
  slug: text("slug").notNull().unique(),
  category: text("category"), // For compatibility 
  imageUrls: text("image_urls").array(),
  videoUrl: text("video_url"),
  isFeatured: boolean("is_featured").default(false),
});

export const insertInteriorProjectSchema = createInsertSchema(interiorProjects).pick({
  id: true,
  title: true,
  style: true,
  budget: true,
  location: true,
  image: true,
  description: true,
  slug: true,
  category: true,
  imageUrls: true,
  videoUrl: true,
  isFeatured: true,
});

// Blog posts schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  publishDate: timestamp("publish_date").notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  category: true,
  imageUrl: true,
  publishDate: true,
});

// Design consultation requests schema
export const consultationRequests = pgTable("consultation_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  projectType: text("project_type").notNull(),
  description: text("description").notNull(),
  budgetRange: text("budget_range"),
  status: text("status").notNull().default("pending"), // pending, contacted, completed, cancelled
  createdAt: timestamp("created_at").notNull(),
});

export const insertConsultationRequestSchema = createInsertSchema(consultationRequests).pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  projectType: true,
  description: true,
  budgetRange: true,
  status: true,
  createdAt: true,
});

// Cart items schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id"), // For guest carts
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  sessionId: true,
  productId: true,
  quantity: true,
});

// Wishlist items schema
export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).pick({
  userId: true,
  productId: true,
});

// Testimonials schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  projectType: text("project_type").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(), // Rating out of 5
  initials: text("initials"), // E.g., "JS" for "Jennifer S."
  displayOrder: integer("display_order"),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  projectType: true,
  content: true,
  rating: true,
  initials: true,
  displayOrder: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type InteriorProject = typeof interiorProjects.$inferSelect;
export type InsertInteriorProject = z.infer<typeof insertInteriorProjectSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
