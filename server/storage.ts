import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  posts, type Post, type InsertPost, type UpdatePost,
  comments, type Comment, type InsertComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, SQL, sql } from "drizzle-orm";

// Storage interface for database operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Post operations
  getAllPosts(filter?: {
    categoryId?: number;
    search?: string;
    status?: string;
  }): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, data: UpdatePost): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Comment operations
  getCommentsByPostId(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Post operations
  async getAllPosts(filter?: {
    categoryId?: number;
    search?: string;
    status?: string;
  }): Promise<Post[]> {
    let query = db.select().from(posts);
    
    const conditions: SQL[] = [];
    
    if (filter?.categoryId) {
      conditions.push(eq(posts.categoryId, filter.categoryId));
    }
    
    if (filter?.status) {
      conditions.push(eq(posts.status, filter.status));
    }
    
    if (filter?.search) {
      conditions.push(
        sql`(${posts.title} ILIKE ${`%${filter.search}%`} OR ${posts.excerpt} ILIKE ${`%${filter.search}%`} OR ${posts.content} ILIKE ${`%${filter.search}%`})`
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(posts.createdAt));
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return newPost;
  }

  async updatePost(id: number, data: UpdatePost): Promise<Post | undefined> {
    const [updatedPost] = await db
      .update(posts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(eq(posts.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Comment operations
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
