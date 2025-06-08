import type { Express } from "express";
import { createServer, type Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertStorySchema, insertCommentSchema, insertTipSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Story routes
  app.get("/api/stories", async (req, res) => {
    try {
      const { mood, limit, offset } = req.query;
      let stories;
      
      if (mood && mood !== "all") {
        stories = await storage.getStoriesByMood(mood as string);
      } else {
        stories = await storage.getAllStories(
          limit ? parseInt(limit as string) : undefined,
          offset ? parseInt(offset as string) : undefined
        );
      }

      // Get author info for each story
      const storiesWithAuthors = await Promise.all(stories.map(async (story) => {
        const author = await storage.getUser(story.authorId);
        return {
          ...story,
          author: author ? {
            id: author.id,
            username: author.username,
            avatar: author.avatar
          } : null
        };
      }));

      res.json(storiesWithAuthors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/stories/featured", async (req, res) => {
    try {
      const stories = await storage.getFeaturedStories();
      const storiesWithAuthors = await Promise.all(stories.map(async (story) => {
        const author = await storage.getUser(story.authorId);
        return {
          ...story,
          author: author ? {
            id: author.id,
            username: author.username,
            avatar: author.avatar
          } : null
        };
      }));
      res.json(storiesWithAuthors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const story = await storage.getStory(parseInt(req.params.id));
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      // Increment view count
      await storage.incrementStoryViews(story.id);

      // Get author info
      const author = await storage.getUser(story.authorId);
      
      res.json({
        ...story,
        author: author ? {
          id: author.id,
          username: author.username,
          avatar: author.avatar,
          bio: author.bio
        } : null
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      res.status(201).json(story);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const story = await storage.updateStory(id, updates);
      res.json(story);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteStory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json({ message: "Story deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Comment routes
  app.get("/api/stories/:id/comments", async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const comments = await storage.getCommentsByStory(storyId);
      
      // Get user info for each comment
      const commentsWithUsers = await Promise.all(comments.map(async (comment) => {
        const user = await storage.getUser(comment.userId);
        return {
          ...comment,
          user: user ? {
            id: user.id,
            username: user.username,
            avatar: user.avatar
          } : null
        };
      }));

      res.json(commentsWithUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/stories/:id/comments", async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const commentData = { ...req.body, storyId };
      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Like routes
  app.post("/api/stories/:id/like", async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const { userId } = req.body;
      const liked = await storage.toggleLike(userId, storyId);
      const likeCount = await storage.getLikesByStory(storyId);
      res.json({ liked, likeCount });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/stories/:id/like-status/:userId", async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const userId = parseInt(req.params.userId);
      const hasLiked = await storage.hasUserLikedStory(userId, storyId);
      const likeCount = await storage.getLikesByStory(storyId);
      res.json({ hasLiked, likeCount });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Challenge routes
  app.get("/api/challenges/active", async (req, res) => {
    try {
      const challenge = await storage.getActiveChallenge();
      res.json(challenge);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User achievements
  app.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics routes
  app.get("/api/users/:id/analytics", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userStories = await storage.getStoriesByAuthor(userId);
      
      const totalReads = userStories.reduce((sum, story) => sum + (story.views || 0), 0);
      const totalHearts = userStories.reduce((sum, story) => sum + (story.likes || 0), 0);
      const user = await storage.getUser(userId);
      const tips = await storage.getTipsByUser(userId);
      const totalEarnings = tips.reduce((sum, tip) => sum + parseFloat(tip.amount), 0);

      const analytics = {
        totalReads,
        totalHearts,
        followers: user?.followers || 0,
        earnings: totalEarnings,
        storiesCount: userStories.length,
        topStories: userStories
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
      };

      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment route for tips
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, storyId, authorId, message } = req.body;
      
      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          storyId: storyId.toString(),
          authorId: authorId.toString(),
          message: message || ""
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Tip routes
  app.post("/api/tips", async (req, res) => {
    try {
      const validatedData = insertTipSchema.parse(req.body);
      const tip = await storage.createTip(validatedData);
      res.status(201).json(tip);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'join_story':
            // Join a story room for real-time comments
            ws.send(JSON.stringify({ 
              type: 'joined_story', 
              storyId: data.storyId 
            }));
            break;
            
          case 'new_comment':
            // Broadcast new comment to all clients reading this story
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'comment_added',
                  storyId: data.storyId,
                  comment: data.comment
                }));
              }
            });
            break;
            
          case 'story_like':
            // Broadcast like update
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'story_liked',
                  storyId: data.storyId,
                  likeCount: data.likeCount
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
