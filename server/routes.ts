import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPostSchema, 
  updatePostSchema, 
  insertCategorySchema, 
  insertCommentSchema 
} from "@shared/schema";
import { z } from "zod";

// Helper function to generate slugs
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories endpoints
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validation = insertCategorySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid category data", errors: validation.error.format() });
      }
      
      const { name } = validation.data;
      const slug = generateSlug(name);
      
      const existingCategory = await storage.getCategoryBySlug(slug);
      if (existingCategory) {
        return res.status(400).json({ message: "A category with this name already exists" });
      }
      
      const newCategory = await storage.createCategory({ ...validation.data, slug });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const validation = insertCategorySchema.partial().safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid category data", errors: validation.error.format() });
      }
      
      const data = validation.data;
      
      // If name is provided, update the slug
      if (data.name) {
        data.slug = generateSlug(data.name);
        
        // Check if slug already exists
        const existingCategory = await storage.getCategoryBySlug(data.slug);
        if (existingCategory && existingCategory.id !== id) {
          return res.status(400).json({ message: "A category with this name already exists" });
        }
      }
      
      const updatedCategory = await storage.updateCategory(id, data);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const deleted = await storage.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Posts endpoints
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const filter: {
        categoryId?: number;
        search?: string;
        status?: string;
      } = {};
      
      if (req.query.categoryId) {
        filter.categoryId = parseInt(req.query.categoryId as string);
      }
      
      if (req.query.search) {
        filter.search = req.query.search as string;
      }
      
      if (req.query.status) {
        filter.status = req.query.status as string;
      }
      
      const posts = await storage.getAllPosts(filter);
      
      // For each post, get the category
      const postsWithCategories = await Promise.all(posts.map(async (post) => {
        let category = null;
        if (post.categoryId) {
          category = await storage.getCategoryById(post.categoryId);
        }
        
        const author = await storage.getUser(post.userId);
        
        return {
          ...post,
          category,
          author
        };
      }));
      
      res.json(postsWithCategories);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPostById(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      let category = null;
      if (post.categoryId) {
        category = await storage.getCategoryById(post.categoryId);
      }
      
      const author = await storage.getUser(post.userId);
      
      res.json({
        ...post,
        category,
        author
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", async (req: Request, res: Response) => {
    try {
      // Hard-code user ID for now (in a real app, this would come from the authenticated user)
      const userId = 1;
      
      const validation = insertPostSchema
        .omit({ userId: true, slug: true })
        .safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid post data", errors: validation.error.format() });
      }
      
      const { title } = validation.data;
      const slug = generateSlug(title);
      
      const existingPost = await storage.getPostBySlug(slug);
      if (existingPost) {
        return res.status(400).json({ message: "A post with this title already exists" });
      }
      
      const newPost = await storage.createPost({
        ...validation.data,
        userId,
        slug
      });
      
      let category = null;
      if (newPost.categoryId) {
        category = await storage.getCategoryById(newPost.categoryId);
      }
      
      const author = await storage.getUser(newPost.userId);
      
      res.status(201).json({
        ...newPost,
        category,
        author
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const validation = updatePostSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid post data", errors: validation.error.format() });
      }
      
      const data = validation.data;
      
      // If title is provided, update the slug
      if (data.title) {
        data.slug = generateSlug(data.title);
        
        // Check if slug already exists for a different post
        const existingPost = await storage.getPostBySlug(data.slug);
        if (existingPost && existingPost.id !== id) {
          return res.status(400).json({ message: "A post with this title already exists" });
        }
      }
      
      const updatedPost = await storage.updatePost(id, data);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      let category = null;
      if (updatedPost.categoryId) {
        category = await storage.getCategoryById(updatedPost.categoryId);
      }
      
      const author = await storage.getUser(updatedPost.userId);
      
      res.json({
        ...updatedPost,
        category,
        author
      });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const deleted = await storage.deletePost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Comments endpoints
  app.get("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const comments = await storage.getCommentsByPostId(postId);
      
      // Fetch author for each comment
      const commentsWithAuthors = await Promise.all(comments.map(async (comment) => {
        const author = await storage.getUser(comment.userId);
        return {
          ...comment,
          author
        };
      }));
      
      res.json(commentsWithAuthors);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      // Hard-code user ID for now (in a real app, this would come from the authenticated user)
      const userId = 1;
      
      const validation = insertCommentSchema
        .omit({ userId: true, postId: true })
        .safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid comment data", errors: validation.error.format() });
      }
      
      const post = await storage.getPostById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const newComment = await storage.createComment({
        ...validation.data,
        userId,
        postId
      });
      
      const author = await storage.getUser(newComment.userId);
      
      res.status(201).json({
        ...newComment,
        author
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.delete("/api/comments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
      
      const deleted = await storage.deleteComment(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Seed data if needed
  app.post("/api/seed", async (req: Request, res: Response) => {
    try {
      // First check if we already have a user
      const existingUser = await storage.getUserByUsername("admin");
      
      if (!existingUser) {
        // Create default admin user
        await storage.createUser({
          username: "admin",
          password: "admin", // In a real app, this would be hashed
        });
      }
      
      // Check if we have categories
      const categories = await storage.getAllCategories();
      
      if (categories.length === 0) {
        // Create some default categories
        await Promise.all([
          storage.createCategory({ name: "Technology", slug: "technology" }),
          storage.createCategory({ name: "Design", slug: "design" }),
          storage.createCategory({ name: "Business", slug: "business" }),
          storage.createCategory({ name: "Programming", slug: "programming" }),
        ]);
      }
      
      res.status(200).json({ message: "Seed data created successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ message: "Failed to seed data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
