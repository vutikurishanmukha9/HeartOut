import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: text("cover_image"),
  authorId: integer("author_id").notNull(),
  status: text("status").notNull().default("draft"), // draft, published, archived
  mood: text("mood"), // reflective, uplifting, adventure, romance, mystery, sci-fi
  readTime: integer("read_time").notNull(), // in minutes
  wordCount: integer("word_count").notNull(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  views: integer("views").default(0),
  featured: boolean("featured").default(false),
  sections: jsonb("sections"), // for drag-and-drop story canvas
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  parentId: integer("parent_id"), // for nested comments
  createdAt: timestamp("created_at").defaultNow(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  prompt: text("prompt").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  submissions: integer("submissions").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challengeSubmissions = pgTable("challenge_submissions", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull(),
  storyId: integer("story_id").notNull(),
  userId: integer("user_id").notNull(),
  votes: integer("votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  content: text("content").notNull(),
  rating: integer("rating"), // 1-5 stars
  isCompleted: boolean("is_completed").default(false),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // first_story, loved, helpful, on_fire, champion, rising_star
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  likes: true,
  comments: true,
  views: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  createdAt: true,
  stripePaymentIntentId: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  submissions: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Like = typeof likes.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Tip = typeof tips.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
