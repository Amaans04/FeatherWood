import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertInteriorProjectSchema, 
  insertBlogPostSchema, 
  insertConsultationRequestSchema, 
  insertCartItemSchema,
  insertWishlistItemSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all product categories
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    const { category, minPrice, maxPrice, material, search } = req.query;
    
    if (search && typeof search === 'string') {
      const products = await storage.searchProducts(search);
      return res.json(products);
    }
    
    if (category || minPrice || maxPrice || material) {
      const filters: { 
        categoryId?: number;
        minPrice?: number;
        maxPrice?: number;
        material?: string;
      } = {};
      
      if (category && typeof category === 'string') {
        const categoryObj = await storage.getCategoryBySlug(category);
        if (categoryObj) {
          filters.categoryId = categoryObj.id;
        }
      }
      
      if (minPrice && typeof minPrice === 'string') {
        filters.minPrice = parseInt(minPrice);
      }
      
      if (maxPrice && typeof maxPrice === 'string') {
        filters.maxPrice = parseInt(maxPrice);
      }
      
      if (material && typeof material === 'string') {
        filters.material = material;
      }
      
      const products = await storage.filterProducts(filters);
      return res.json(products);
    }
    
    const products = await storage.getAllProducts();
    res.json(products);
  });

  // Get featured products
  app.get("/api/products/featured", async (req, res) => {
    const products = await storage.getFeaturedProducts();
    res.json(products);
  });

  // Get product by slug
  app.get("/api/products/:slug", async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Get all interior design projects
  app.get("/api/projects", async (req, res) => {
    const { category } = req.query;
    
    if (category && typeof category === 'string') {
      const projects = await storage.getProjectsByCategory(category);
      return res.json(projects);
    }
    
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  // Get featured interior design projects
  app.get("/api/projects/featured", async (req, res) => {
    const projects = await storage.getFeaturedProjects();
    res.json(projects);
  });

  // Get project by slug
  app.get("/api/projects/:slug", async (req, res) => {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  // Get all blog posts
  app.get("/api/blog", async (req, res) => {
    const posts = await storage.getAllBlogPosts();
    res.json(posts);
  });

  // Get recent blog posts
  app.get("/api/blog/recent", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
    const posts = await storage.getRecentBlogPosts(limit);
    res.json(posts);
  });

  // Get blog post by slug
  app.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(post);
  });

  // Create consultation request
  app.post("/api/consultation-requests", async (req, res) => {
    try {
      const data = insertConsultationRequestSchema.parse({
        ...req.body,
        createdAt: new Date()
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

  // Get cart items
  app.get("/api/cart", async (req, res) => {
    const { userId, sessionId } = req.query;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ message: "Either userId or sessionId is required" });
    }
    
    const cartItems = await storage.getCartItems(
      userId ? parseInt(userId as string) : undefined,
      sessionId as string | undefined
    );
    
    const productIds = cartItems.map(item => item.productId);
    const products = await Promise.all(
      productIds.map(id => storage.getProductById(id))
    );
    
    const cartWithProducts = cartItems.map(item => {
      const product = products.find(p => p?.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    });
    
    res.json(cartWithProducts);
  });

  // Add item to cart
  app.post("/api/cart", async (req, res) => {
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

  // Update cart item quantity
  app.patch("/api/cart/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    
    if (typeof quantity !== 'number' || quantity < 1) {
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

  // Remove item from cart
  app.delete("/api/cart/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.removeFromCart(id);
    if (!success) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ success: true });
  });

  // Clear cart
  app.delete("/api/cart", async (req, res) => {
    const { userId, sessionId } = req.query;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ message: "Either userId or sessionId is required" });
    }
    
    await storage.clearCart(
      userId ? parseInt(userId as string) : undefined,
      sessionId as string | undefined
    );
    
    res.json({ success: true });
  });

  // Get wishlist items
  app.get("/api/wishlist", async (req, res) => {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    
    const wishlistItems = await storage.getWishlistItems(parseInt(userId as string));
    
    const productIds = wishlistItems.map(item => item.productId);
    const products = await Promise.all(
      productIds.map(id => storage.getProductById(id))
    );
    
    const wishlistWithProducts = wishlistItems.map(item => {
      const product = products.find(p => p?.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    });
    
    res.json(wishlistWithProducts);
  });

  // Add item to wishlist
  app.post("/api/wishlist", async (req, res) => {
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

  // Remove item from wishlist
  app.delete("/api/wishlist", async (req, res) => {
    const { userId, productId } = req.query;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: "Both userId and productId are required" });
    }
    
    const success = await storage.removeFromWishlist(
      parseInt(userId as string),
      parseInt(productId as string)
    );
    
    if (!success) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }
    
    res.json({ success: true });
  });

  // Check if item is in wishlist
  app.get("/api/wishlist/check", async (req, res) => {
    const { userId, productId } = req.query;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: "Both userId and productId are required" });
    }
    
    const isInWishlist = await storage.isInWishlist(
      parseInt(userId as string),
      parseInt(productId as string)
    );
    
    res.json({ isInWishlist });
  });

  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    const { limit } = req.query;
    
    if (limit) {
      const testimonials = await storage.getFeaturedTestimonials(parseInt(limit as string));
      return res.json(testimonials);
    }
    
    const testimonials = await storage.getAllTestimonials();
    res.json(testimonials);
  });

  const httpServer = createServer(app);
  return httpServer;
}
