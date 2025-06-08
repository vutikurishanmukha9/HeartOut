import { 
  users, stories, comments, likes, follows, challenges, challengeSubmissions, 
  reviews, tips, achievements, 
  type User, type InsertUser, type Story, type InsertStory, type Comment, 
  type InsertComment, type Challenge, type InsertChallenge, type Review, 
  type InsertReview, type Tip, type InsertTip, type Achievement, type InsertAchievement 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User>;

  // Stories
  getStory(id: number): Promise<Story | undefined>;
  getStoriesByAuthor(authorId: number): Promise<Story[]>;
  getFeaturedStories(): Promise<Story[]>;
  getStoriesByMood(mood: string): Promise<Story[]>;
  getAllStories(limit?: number, offset?: number): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, updates: Partial<Story>): Promise<Story>;
  deleteStory(id: number): Promise<boolean>;
  incrementStoryViews(id: number): Promise<void>;

  // Comments
  getCommentsByStory(storyId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;

  // Likes
  getLikesByStory(storyId: number): Promise<number>;
  hasUserLikedStory(userId: number, storyId: number): Promise<boolean>;
  toggleLike(userId: number, storyId: number): Promise<boolean>;

  // Follows
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  toggleFollow(followerId: number, followingId: number): Promise<boolean>;
  getFollowers(userId: number): Promise<User[]>;
  getFollowing(userId: number): Promise<User[]>;

  // Challenges
  getActiveChallenge(): Promise<Challenge | undefined>;
  getAllChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getChallengeSubmissions(challengeId: number): Promise<any[]>;

  // Reviews
  getReviewsForUser(userId: number): Promise<Review[]>;
  getPendingReviews(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, updates: Partial<Review>): Promise<Review>;

  // Tips
  getTipsByStory(storyId: number): Promise<Tip[]>;
  getTipsByUser(userId: number): Promise<Tip[]>;
  createTip(tip: InsertTip): Promise<Tip>;

  // Achievements
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private stories: Map<number, Story> = new Map();
  private comments: Map<number, Comment> = new Map();
  private likes: Map<number, any> = new Map();
  private follows: Map<number, any> = new Map();
  private challenges: Map<number, Challenge> = new Map();
  private challengeSubmissions: Map<number, any> = new Map();
  private reviews: Map<number, Review> = new Map();
  private tips: Map<number, Tip> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private getNextId(): number {
    return this.currentId++;
  }

  private seedData() {
    // Seed some initial users
    const authors = [
      { username: "emily_watson", email: "emily@example.com", password: "password", avatar: "EM", bio: "Nature lover and outdoor enthusiast", followers: 234, following: 45 },
      { username: "marcus_kim", email: "marcus@example.com", password: "password", avatar: "MK", bio: "Coffee connoisseur and night owl", followers: 156, following: 32 },
      { username: "zara_lopez", email: "zara@example.com", password: "password", avatar: "ZL", bio: "Sci-fi writer and tech enthusiast", followers: 398, following: 67 },
      { username: "riley_brooks", email: "riley@example.com", password: "password", avatar: "RB", bio: "Romance writer and beach lover", followers: 287, following: 54 },
      { username: "thomas_hart", email: "thomas@example.com", password: "password", avatar: "TH", bio: "Mystery writer and librarian", followers: 445, following: 23 },
      { username: "alex_stone", email: "alex@example.com", password: "password", avatar: "AS", bio: "Adventure seeker and mountain climber", followers: 512, following: 89 }
    ];

    authors.forEach((author, index) => {
      const user: User = {
        id: this.getNextId(),
        ...author,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        createdAt: new Date()
      };
      this.users.set(user.id, user);
    });

    // Seed some initial stories
    const storyData = [
      {
        title: "Finding Peace in the Mountains",
        content: "The trail stretched endlessly ahead, winding through ancient pines that seemed to whisper secrets of the centuries...",
        excerpt: "A journey of self-discovery through hiking the Appalachian Trail, where every step brought me closer to understanding what truly matters in life...",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        authorId: 1,
        status: "published",
        mood: "uplifting",
        readTime: 7,
        wordCount: 1247,
        likes: 156,
        comments: 23,
        views: 3247,
        featured: true,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
      },
      {
        title: "The Coffee Shop at 3 AM",
        content: "There's something magical about the only 24-hour coffee shop in town, where night owls and early birds cross paths...",
        excerpt: "There's something magical about the only 24-hour coffee shop in town, where night owls and early birds cross paths in the most unexpected ways...",
        coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        authorId: 2,
        status: "published",
        mood: "reflective",
        readTime: 5,
        wordCount: 892,
        likes: 89,
        comments: 12,
        views: 2156,
        featured: false,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
      },
      {
        title: "City of Tomorrow",
        content: "In 2087, when humans and AI coexist in Neo-Tokyo, a young detective uncovers a conspiracy...",
        excerpt: "In 2087, when humans and AI coexist in Neo-Tokyo, a young detective uncovers a conspiracy that threatens the delicate balance between two worlds...",
        coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        authorId: 3,
        status: "published",
        mood: "sci-fi",
        readTime: 12,
        wordCount: 2156,
        likes: 267,
        comments: 45,
        views: 4892,
        featured: true,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        title: "Summer's End",
        content: "The last sunset of summer vacation, a beach in Maine, and the realization that some moments are meant to be treasured forever...",
        excerpt: "The last sunset of summer vacation, a beach in Maine, and the realization that some moments are meant to be treasured forever...",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        authorId: 4,
        status: "published",
        mood: "romance",
        readTime: 6,
        wordCount: 1034,
        likes: 124,
        comments: 18,
        views: 2341,
        featured: false,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        title: "The Librarian's Secret",
        content: "Behind the restricted section lies a mystery that has been waiting decades to be solved...",
        excerpt: "Behind the restricted section lies a mystery that has been waiting decades to be solved. But some secrets are buried for good reason...",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        authorId: 5,
        status: "published",
        mood: "mystery",
        readTime: 9,
        wordCount: 1567,
        likes: 198,
        comments: 34,
        views: 3021,
        featured: false,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        title: "Summit at Dawn",
        content: "The final push to Everest's summit teaches you more about yourself than any classroom ever could...",
        excerpt: "The final push to Everest's summit teaches you more about yourself than any classroom ever could. Here's what I learned at 29,000 feet...",
        coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        authorId: 6,
        status: "published",
        mood: "adventure",
        readTime: 15,
        wordCount: 2834,
        likes: 342,
        comments: 67,
        views: 5123,
        featured: true,
        publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      }
    ];

    storyData.forEach((story) => {
      const newStory: Story = {
        id: this.getNextId(),
        ...story,
        sections: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.stories.set(newStory.id, newStory);
    });

    // Seed active challenge
    const challenge: Challenge = {
      id: this.getNextId(),
      title: "A Letter Never Sent",
      description: "Write a story about a letter that was written but never delivered.",
      prompt: "Write a story about a letter that was written but never delivered. What was in it? Why wasn't it sent? What happens when it's finally discovered?",
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      submissions: 127,
      isActive: true,
      createdAt: new Date()
    };
    this.challenges.set(challenge.id, challenge);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.getNextId(),
      ...insertUser,
      followers: 0,
      following: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User> {
    return this.updateUser(id, { 
      stripeCustomerId: customerId, 
      stripeSubscriptionId: subscriptionId 
    });
  }

  // Story methods
  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStoriesByAuthor(authorId: number): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => story.authorId === authorId);
  }

  async getFeaturedStories(): Promise<Story[]> {
    return Array.from(this.stories.values())
      .filter(story => story.featured && story.status === "published")
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getStoriesByMood(mood: string): Promise<Story[]> {
    return Array.from(this.stories.values())
      .filter(story => story.mood === mood && story.status === "published")
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getAllStories(limit?: number, offset?: number): Promise<Story[]> {
    const stories = Array.from(this.stories.values())
      .filter(story => story.status === "published")
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
    
    if (limit !== undefined) {
      const start = offset || 0;
      return stories.slice(start, start + limit);
    }
    
    return stories;
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const story: Story = {
      id: this.getNextId(),
      ...insertStory,
      likes: 0,
      comments: 0,
      views: 0,
      publishedAt: insertStory.status === "published" ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.stories.set(story.id, story);
    return story;
  }

  async updateStory(id: number, updates: Partial<Story>): Promise<Story> {
    const story = this.stories.get(id);
    if (!story) throw new Error("Story not found");
    
    const updatedStory = { 
      ...story, 
      ...updates, 
      updatedAt: new Date(),
      publishedAt: updates.status === "published" && !story.publishedAt ? new Date() : story.publishedAt
    };
    this.stories.set(id, updatedStory);
    return updatedStory;
  }

  async deleteStory(id: number): Promise<boolean> {
    return this.stories.delete(id);
  }

  async incrementStoryViews(id: number): Promise<void> {
    const story = this.stories.get(id);
    if (story) {
      story.views = (story.views || 0) + 1;
      this.stories.set(id, story);
    }
  }

  // Comment methods
  async getCommentsByStory(storyId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.storyId === storyId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const comment: Comment = {
      id: this.getNextId(),
      ...insertComment,
      createdAt: new Date()
    };
    this.comments.set(comment.id, comment);
    
    // Increment story comment count
    const story = this.stories.get(insertComment.storyId);
    if (story) {
      story.comments = (story.comments || 0) + 1;
      this.stories.set(story.id, story);
    }
    
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = this.comments.get(id);
    if (comment) {
      // Decrement story comment count
      const story = this.stories.get(comment.storyId);
      if (story && story.comments > 0) {
        story.comments = story.comments - 1;
        this.stories.set(story.id, story);
      }
    }
    return this.comments.delete(id);
  }

  // Like methods
  async getLikesByStory(storyId: number): Promise<number> {
    return Array.from(this.likes.values()).filter(like => like.storyId === storyId).length;
  }

  async hasUserLikedStory(userId: number, storyId: number): Promise<boolean> {
    return Array.from(this.likes.values()).some(like => 
      like.userId === userId && like.storyId === storyId
    );
  }

  async toggleLike(userId: number, storyId: number): Promise<boolean> {
    const existingLike = Array.from(this.likes.values()).find(like => 
      like.userId === userId && like.storyId === storyId
    );

    const story = this.stories.get(storyId);
    if (!story) return false;

    if (existingLike) {
      // Remove like
      this.likes.delete(existingLike.id);
      story.likes = Math.max(0, (story.likes || 0) - 1);
      this.stories.set(storyId, story);
      return false;
    } else {
      // Add like
      const like = {
        id: this.getNextId(),
        storyId,
        userId,
        createdAt: new Date()
      };
      this.likes.set(like.id, like);
      story.likes = (story.likes || 0) + 1;
      this.stories.set(storyId, story);
      return true;
    }
  }

  // Follow methods
  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    return Array.from(this.follows.values()).some(follow => 
      follow.followerId === followerId && follow.followingId === followingId
    );
  }

  async toggleFollow(followerId: number, followingId: number): Promise<boolean> {
    const existingFollow = Array.from(this.follows.values()).find(follow => 
      follow.followerId === followerId && follow.followingId === followingId
    );

    if (existingFollow) {
      this.follows.delete(existingFollow.id);
      return false;
    } else {
      const follow = {
        id: this.getNextId(),
        followerId,
        followingId,
        createdAt: new Date()
      };
      this.follows.set(follow.id, follow);
      return true;
    }
  }

  async getFollowers(userId: number): Promise<User[]> {
    const followers = Array.from(this.follows.values())
      .filter(follow => follow.followingId === userId)
      .map(follow => this.users.get(follow.followerId))
      .filter(user => user !== undefined) as User[];
    return followers;
  }

  async getFollowing(userId: number): Promise<User[]> {
    const following = Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId)
      .map(follow => this.users.get(follow.followingId))
      .filter(user => user !== undefined) as User[];
    return following;
  }

  // Challenge methods
  async getActiveChallenge(): Promise<Challenge | undefined> {
    return Array.from(this.challenges.values()).find(challenge => challenge.isActive);
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const challenge: Challenge = {
      id: this.getNextId(),
      ...insertChallenge,
      submissions: 0,
      createdAt: new Date()
    };
    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  async getChallengeSubmissions(challengeId: number): Promise<any[]> {
    return Array.from(this.challengeSubmissions.values())
      .filter(submission => submission.challengeId === challengeId)
      .sort((a, b) => b.votes - a.votes);
  }

  // Review methods
  async getReviewsForUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.reviewerId === userId);
  }

  async getPendingReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.reviewerId === userId && !review.isCompleted);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const review: Review = {
      id: this.getNextId(),
      ...insertReview,
      createdAt: new Date()
    };
    this.reviews.set(review.id, review);
    return review;
  }

  async updateReview(id: number, updates: Partial<Review>): Promise<Review> {
    const review = this.reviews.get(id);
    if (!review) throw new Error("Review not found");
    
    const updatedReview = { ...review, ...updates };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  // Tip methods
  async getTipsByStory(storyId: number): Promise<Tip[]> {
    return Array.from(this.tips.values()).filter(tip => tip.storyId === storyId);
  }

  async getTipsByUser(userId: number): Promise<Tip[]> {
    return Array.from(this.tips.values()).filter(tip => tip.toUserId === userId);
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const tip: Tip = {
      id: this.getNextId(),
      ...insertTip,
      stripePaymentIntentId: null,
      createdAt: new Date()
    };
    this.tips.set(tip.id, tip);
    return tip;
  }

  // Achievement methods
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      id: this.getNextId(),
      ...insertAchievement,
      unlockedAt: new Date()
    };
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
