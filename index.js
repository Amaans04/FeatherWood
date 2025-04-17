// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var MemStorage = class {
  users;
  categories;
  products;
  projects;
  blogPosts;
  consultationRequests;
  cartItems;
  wishlistItems;
  testimonials;
  currentUserId;
  currentCategoryId;
  currentProductId;
  currentProjectId;
  currentBlogPostId;
  currentConsultationRequestId;
  currentCartItemId;
  currentWishlistItemId;
  currentTestimonialId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.blogPosts = /* @__PURE__ */ new Map();
    this.consultationRequests = /* @__PURE__ */ new Map();
    this.cartItems = /* @__PURE__ */ new Map();
    this.wishlistItems = /* @__PURE__ */ new Map();
    this.testimonials = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentProjectId = 1;
    this.currentBlogPostId = 1;
    this.currentConsultationRequestId = 1;
    this.currentCartItemId = 1;
    this.currentWishlistItemId = 1;
    this.currentTestimonialId = 1;
    this.initializeData();
  }
  // Initialize sample data
  async initializeData() {
    const categories = [
      { name: "Living Room", slug: "living-room", description: "Furniture for your living spaces", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" },
      { name: "Bedroom", slug: "bedroom", description: "Comfortable beds and bedroom furniture", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
      { name: "Dining Room", slug: "dining-room", description: "Elegant dining tables and chairs", imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267" },
      { name: "Kitchen", slug: "kitchen", description: "Modern kitchen furniture and accessories", imageUrl: "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7" },
      { name: "Office", slug: "office", description: "Productive workspace furniture", imageUrl: "https://images.unsplash.com/photo-1516397281156-3c1ddf2388c5" }
    ];
    for (const category of categories) {
      await this.createCategory(category);
    }
    try {
      const productsFilePath = path.resolve(__dirname, "data/furnitureProducts.json");
      if (fs.existsSync(productsFilePath)) {
        const furnitureProductsData = fs.readFileSync(productsFilePath, "utf8");
        const furnitureProducts = JSON.parse(furnitureProductsData);
        for (const product of furnitureProducts) {
          this.products.set(product.id, product);
        }
        console.log(`Loaded ${furnitureProducts.length} furniture products from JSON`);
      } else {
        console.log("Furniture products JSON file not found, using default data");
        const defaultProduct = {
          id: "f000",
          title: "Emerald Velvet Sofa",
          slug: "emerald-velvet-sofa",
          description: "A luxurious green velvet sofa with elegant wooden legs.",
          price: 129900,
          // $1,299.00
          image: "sofa.jpg",
          category: "Living Room",
          tags: ["sofa", "velvet", "luxury"],
          rating: 45,
          // 4.5 out of 5
          material: "Velvet, Wood",
          dimensions: '85"W x 36"D x 33"H',
          color: "Emerald Green",
          inStock: true,
          isNew: true,
          isFeatured: true,
          imageUrls: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc"]
        };
        this.products.set(defaultProduct.id, defaultProduct);
      }
    } catch (error) {
      console.error("Error loading furniture products:", error);
    }
    try {
      const projectsFilePath = path.resolve(__dirname, "data/interiorProjects.json");
      if (fs.existsSync(projectsFilePath)) {
        const interiorProjectsData = fs.readFileSync(projectsFilePath, "utf8");
        const interiorProjects2 = JSON.parse(interiorProjectsData);
        for (const project of interiorProjects2) {
          this.projects.set(project.id, project);
        }
        console.log(`Loaded ${interiorProjects2.length} interior projects from JSON`);
      } else {
        console.log("Interior projects JSON file not found, using default data");
        const defaultProject = {
          id: "p000",
          title: "Contemporary Urban Kitchen",
          slug: "contemporary-urban-kitchen",
          description: "A sleek, modern kitchen design with optimized storage and premium appliances for a professional chef.",
          style: "Modern",
          budget: "12L",
          location: "Mumbai",
          category: "Modular Kitchen",
          image: "kitchen.jpg",
          isFeatured: true,
          imageUrls: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"]
        };
        this.projects.set(defaultProject.id, defaultProject);
      }
    } catch (error) {
      console.error("Error loading interior projects:", error);
    }
    const projects = [
      {
        title: "Contemporary Urban Kitchen",
        slug: "contemporary-urban-kitchen",
        description: "A sleek, modern kitchen design with optimized storage and premium appliances for a professional chef.",
        category: "Modular Kitchen",
        imageUrls: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"],
        isFeatured: true
      },
      {
        title: "Elegant Family Living Space",
        slug: "elegant-family-living-space",
        description: "A harmonious blend of comfort and sophistication created for a family of four in a suburban home.",
        category: "Living Room",
        imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
        isFeatured: true
      },
      {
        title: "Serene Master Retreat",
        slug: "serene-master-retreat",
        description: "A tranquil sanctuary with custom storage solutions and a calming color palette for optimal relaxation.",
        category: "Bedroom",
        imageUrls: ["https://images.unsplash.com/photo-1560185893-a55cbc8c57e8"],
        isFeatured: true
      }
    ];
    for (const project of projects) {
      await this.createProject(project);
    }
    const blogPosts2 = [
      {
        title: "10 Ways to Bring Nature Into Your Living Space",
        slug: "10-ways-to-bring-nature-into-your-living-space",
        content: "Discover how to incorporate biophilic design elements to create a calming, nature-inspired home environment...",
        excerpt: "Discover how to incorporate biophilic design elements to create a calming, nature-inspired home environment.",
        category: "Interior Design",
        imageUrl: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912",
        publishDate: /* @__PURE__ */ new Date("2023-05-12")
      },
      {
        title: "Color Psychology in Home Design: What Your Choices Reveal",
        slug: "color-psychology-in-home-design",
        content: "Learn how different colors affect mood and perception, and how to use them effectively in your home...",
        excerpt: "Learn how different colors affect mood and perception, and how to use them effectively in your home.",
        category: "Color Theory",
        imageUrl: "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7",
        publishDate: /* @__PURE__ */ new Date("2023-04-28")
      },
      {
        title: "Maximizing Space in Small Kitchens: Design Strategies",
        slug: "maximizing-space-in-small-kitchens",
        content: "Smart solutions for creating functional, beautiful kitchens even in limited square footage...",
        excerpt: "Smart solutions for creating functional, beautiful kitchens even in limited square footage.",
        category: "Space Planning",
        imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f",
        publishDate: /* @__PURE__ */ new Date("2023-04-15")
      }
    ];
    for (const post of blogPosts2) {
      await this.createBlogPost(post);
    }
    const testimonials2 = [
      {
        name: "Jennifer S.",
        projectType: "Full Home Design",
        content: "FeatherWood transformed our living room completely. The designer perfectly captured our style and created a space that exceeds our expectations. The furniture pieces are exquisite and durable.",
        rating: 5,
        initials: "JS",
        displayOrder: 1
      },
      {
        name: "Michael R.",
        projectType: "Kitchen Remodel",
        content: "The modular kitchen design by FeatherWood is both functional and beautiful. The team was professional, thorough, and delivered on time. The quality of materials and workmanship is outstanding.",
        rating: 5,
        initials: "MR",
        displayOrder: 2
      },
      {
        name: "Amanda L.",
        projectType: "Furniture Customer",
        content: "We purchased several furniture pieces from FeatherWood for our new home. The quality is exceptional, and their delivery service was prompt and careful. Highly recommend their collection.",
        rating: 45,
        initials: "AL",
        displayOrder: 3
      }
    ];
    for (const testimonial of testimonials2) {
      await this.createTestimonial(testimonial);
    }
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
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
  async getAllCategories() {
    return Array.from(this.categories.values());
  }
  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  async createCategory(insertCategory) {
    const id = this.currentCategoryId++;
    const category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  // Product methods
  async getAllProducts() {
    return Array.from(this.products.values());
  }
  async getProductById(id) {
    return this.products.get(id);
  }
  async getProductBySlug(slug) {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  async getProductsByCategory(categoryId) {
    const category = this.categories.get(categoryId);
    if (!category) return [];
    return Array.from(this.products.values()).filter(
      (product) => product.category === category.name
    );
  }
  async getFeaturedProducts() {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured
    );
  }
  async searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => product.title.toLowerCase().includes(lowerQuery) || product.description.toLowerCase().includes(lowerQuery)
    );
  }
  async filterProducts(filters) {
    return Array.from(this.products.values()).filter((product) => {
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
  async createProduct(insertProduct) {
    const id = `f${this.currentProductId++}`;
    const product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  // Interior project methods
  async getAllProjects() {
    return Array.from(this.projects.values());
  }
  async getProjectById(id) {
    return this.projects.get(id);
  }
  async getProjectBySlug(slug) {
    return Array.from(this.projects.values()).find(
      (project) => project.slug === slug
    );
  }
  async getProjectsByCategory(category) {
    return Array.from(this.projects.values()).filter(
      (project) => project.category === category
    );
  }
  async getFeaturedProjects() {
    return Array.from(this.projects.values()).filter(
      (project) => project.isFeatured
    );
  }
  async createProject(insertProject) {
    const id = `p${this.currentProjectId++}`;
    const project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }
  // Blog post methods
  async getAllBlogPosts() {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }
  async getBlogPostBySlug(slug) {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }
  async getRecentBlogPosts(limit) {
    return Array.from(this.blogPosts.values()).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, limit);
  }
  async createBlogPost(insertPost) {
    const id = this.currentBlogPostId++;
    const post = { ...insertPost, id };
    this.blogPosts.set(id, post);
    return post;
  }
  // Consultation request methods
  async createConsultationRequest(insertRequest) {
    const id = this.currentConsultationRequestId++;
    const request = { ...insertRequest, id };
    this.consultationRequests.set(id, request);
    return request;
  }
  async getAllConsultationRequests() {
    return Array.from(this.consultationRequests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  // Cart methods
  async getCartItems(userId, sessionId) {
    return Array.from(this.cartItems.values()).filter(
      (item) => userId && item.userId === userId || sessionId && item.sessionId === sessionId
    );
  }
  async addToCart(insertItem) {
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => insertItem.userId && item.userId === insertItem.userId && item.productId === insertItem.productId || insertItem.sessionId && item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );
    if (existingItem) {
      existingItem.quantity += insertItem.quantity || 1;
      return existingItem;
    }
    const id = this.currentCartItemId++;
    const cartItem = { ...insertItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  async updateCartItemQuantity(id, quantity) {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.quantity = quantity;
      return cartItem;
    }
    return void 0;
  }
  async removeFromCart(id) {
    return this.cartItems.delete(id);
  }
  async clearCart(userId, sessionId) {
    const cartItemsToRemove = Array.from(this.cartItems.values()).filter(
      (item) => userId && item.userId === userId || sessionId && item.sessionId === sessionId
    );
    for (const item of cartItemsToRemove) {
      this.cartItems.delete(item.id);
    }
    return true;
  }
  // Wishlist methods
  async getWishlistItems(userId) {
    return Array.from(this.wishlistItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  async addToWishlist(insertItem) {
    const existingItem = Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === insertItem.userId && item.productId === insertItem.productId
    );
    if (existingItem) {
      return existingItem;
    }
    const id = this.currentWishlistItemId++;
    const wishlistItem = { ...insertItem, id };
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }
  async removeFromWishlist(userId, productId) {
    const item = Array.from(this.wishlistItems.values()).find(
      (item2) => item2.userId === userId && item2.productId === productId
    );
    if (item) {
      return this.wishlistItems.delete(item.id);
    }
    return false;
  }
  async isInWishlist(userId, productId) {
    return !!Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
  }
  // Testimonial methods
  async getAllTestimonials() {
    return Array.from(this.testimonials.values()).sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );
  }
  async getFeaturedTestimonials(limit) {
    return Array.from(this.testimonials.values()).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).slice(0, limit);
  }
  async createTestimonial(insertTestimonial) {
    const id = this.currentTestimonialId++;
    const testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phoneNumber: true
});
var productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url")
});
var insertProductCategorySchema = createInsertSchema(productCategories).pick({
  name: true,
  slug: true,
  description: true,
  imageUrl: true
});
var products = pgTable("products", {
  id: text("id").primaryKey(),
  // Using string IDs like "f001"
  title: text("title").notNull(),
  price: integer("price").notNull(),
  // Price in cents
  image: text("image").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
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
  imageUrls: text("image_urls").array()
});
var insertProductSchema = createInsertSchema(products).pick({
  id: true,
  title: true,
  price: true,
  image: true,
  category: true,
  subcategory: true,
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
  imageUrls: true
});
var interiorProjects = pgTable("interior_projects", {
  id: text("id").primaryKey(),
  // Using string IDs like "p002"
  title: text("title").notNull(),
  style: text("style").notNull(),
  budget: text("budget").notNull(),
  location: text("location").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  // Keep compatibility with existing fields
  slug: text("slug").notNull().unique(),
  category: text("category"),
  // For compatibility 
  imageUrls: text("image_urls").array(),
  videoUrl: text("video_url"),
  isFeatured: boolean("is_featured").default(false)
});
var insertInteriorProjectSchema = createInsertSchema(interiorProjects).pick({
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
  isFeatured: true
});
var blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  publishDate: timestamp("publish_date").notNull(),
  readTime: text("read_time"),
  author: text("author"),
  tags: text("tags").array()
});
var insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  category: true,
  imageUrl: true,
  publishDate: true
});
var consultationRequests = pgTable("consultation_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  projectType: text("project_type").notNull(),
  description: text("description").notNull(),
  budgetRange: text("budget_range"),
  status: text("status").notNull().default("pending"),
  // pending, contacted, completed, cancelled
  createdAt: timestamp("created_at").notNull()
});
var insertConsultationRequestSchema = createInsertSchema(consultationRequests).pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  projectType: true,
  description: true,
  budgetRange: true,
  status: true,
  createdAt: true
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id"),
  // For guest carts
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1)
});
var insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  sessionId: true,
  productId: true,
  quantity: true
});
var wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull()
});
var insertWishlistItemSchema = createInsertSchema(wishlistItems).pick({
  userId: true,
  productId: true
});
var testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  projectType: text("project_type").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  // Rating out of 5
  initials: text("initials"),
  // E.g., "JS" for "Jennifer S."
  displayOrder: integer("display_order")
});
var insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  projectType: true,
  content: true,
  rating: true,
  initials: true,
  displayOrder: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/categories", async (req, res) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });
  app2.get("/api/categories/:slug", async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });
  app2.get("/api/products", async (req, res) => {
    const { category, minPrice, maxPrice, material, search } = req.query;
    if (search && typeof search === "string") {
      const products3 = await storage.searchProducts(search);
      return res.json(products3);
    }
    if (category || minPrice || maxPrice || material) {
      const filters = {};
      if (category && typeof category === "string") {
        const categoryObj = await storage.getCategoryBySlug(category);
        if (categoryObj) {
          filters.categoryId = categoryObj.id;
        }
      }
      if (minPrice && typeof minPrice === "string") {
        filters.minPrice = parseInt(minPrice);
      }
      if (maxPrice && typeof maxPrice === "string") {
        filters.maxPrice = parseInt(maxPrice);
      }
      if (material && typeof material === "string") {
        filters.material = material;
      }
      const products3 = await storage.filterProducts(filters);
      return res.json(products3);
    }
    const products2 = await storage.getAllProducts();
    res.json(products2);
  });
  app2.get("/api/products/featured", async (req, res) => {
    const products2 = await storage.getFeaturedProducts();
    res.json(products2);
  });
  app2.get("/api/products/:slug", async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });
  app2.get("/api/projects", async (req, res) => {
    const { category } = req.query;
    if (category && typeof category === "string") {
      const projects2 = await storage.getProjectsByCategory(category);
      return res.json(projects2);
    }
    const projects = await storage.getAllProjects();
    res.json(projects);
  });
  app2.get("/api/projects/featured", async (req, res) => {
    const projects = await storage.getFeaturedProjects();
    res.json(projects);
  });
  app2.get("/api/projects/:slug", async (req, res) => {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });
  app2.get("/api/blog", async (req, res) => {
    const posts = await storage.getAllBlogPosts();
    res.json(posts);
  });
  app2.get("/api/blog/recent", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    const posts = await storage.getRecentBlogPosts(limit);
    res.json(posts);
  });
  app2.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(post);
  });
  app2.post("/api/consultation-requests", async (req, res) => {
    try {
      const data = insertConsultationRequestSchema.parse({
        ...req.body,
        createdAt: /* @__PURE__ */ new Date()
      });
      const request = await storage.createConsultationRequest(data);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/cart", async (req, res) => {
    const { userId, sessionId } = req.query;
    if (!userId && !sessionId) {
      return res.status(400).json({ message: "Either userId or sessionId is required" });
    }
    const cartItems2 = await storage.getCartItems(
      userId ? parseInt(userId) : void 0,
      sessionId
    );
    const productIds = cartItems2.map((item) => item.productId);
    const products2 = await Promise.all(
      productIds.map((id) => storage.getProductById(id))
    );
    const cartWithProducts = cartItems2.map((item) => {
      const product = products2.find((p) => p?.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    });
    res.json(cartWithProducts);
  });
  app2.post("/api/cart", async (req, res) => {
    try {
      const data = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(data);
      const product = await storage.getProductById(cartItem.productId);
      res.status(201).json({
        ...cartItem,
        product: product || null
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/cart/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }
    const updatedItem = await storage.updateCartItemQuantity(id, quantity);
    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    const product = await storage.getProductById(updatedItem.productId);
    res.json({
      ...updatedItem,
      product: product || null
    });
  });
  app2.delete("/api/cart/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.removeFromCart(id);
    if (!success) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ success: true });
  });
  app2.delete("/api/cart", async (req, res) => {
    const { userId, sessionId } = req.query;
    if (!userId && !sessionId) {
      return res.status(400).json({ message: "Either userId or sessionId is required" });
    }
    await storage.clearCart(
      userId ? parseInt(userId) : void 0,
      sessionId
    );
    res.json({ success: true });
  });
  app2.get("/api/wishlist", async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const wishlistItems2 = await storage.getWishlistItems(parseInt(userId));
    const productIds = wishlistItems2.map((item) => item.productId);
    const products2 = await Promise.all(
      productIds.map((id) => storage.getProductById(id))
    );
    const wishlistWithProducts = wishlistItems2.map((item) => {
      const product = products2.find((p) => p?.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    });
    res.json(wishlistWithProducts);
  });
  app2.post("/api/wishlist", async (req, res) => {
    try {
      const data = insertWishlistItemSchema.parse(req.body);
      const wishlistItem = await storage.addToWishlist(data);
      const product = await storage.getProductById(wishlistItem.productId);
      res.status(201).json({
        ...wishlistItem,
        product: product || null
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/wishlist", async (req, res) => {
    const { userId, productId } = req.query;
    if (!userId || !productId) {
      return res.status(400).json({ message: "Both userId and productId are required" });
    }
    const success = await storage.removeFromWishlist(
      parseInt(userId),
      parseInt(productId)
    );
    if (!success) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }
    res.json({ success: true });
  });
  app2.get("/api/wishlist/check", async (req, res) => {
    const { userId, productId } = req.query;
    if (!userId || !productId) {
      return res.status(400).json({ message: "Both userId and productId are required" });
    }
    const isInWishlist = await storage.isInWishlist(
      parseInt(userId),
      parseInt(productId)
    );
    res.json({ isInWishlist });
  });
  app2.get("/api/testimonials", async (req, res) => {
    const { limit } = req.query;
    if (limit) {
      const testimonials3 = await storage.getFeaturedTestimonials(parseInt(limit));
      return res.json(testimonials3);
    }
    const testimonials2 = await storage.getAllTestimonials();
    res.json(testimonials2);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "localhost"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
