import { db } from "./db";
import { users, stories, challenges } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database...");

    // Create users
    const [user1, user2, user3] = await db.insert(users).values([
      {
        username: "storyteller_maya",
        email: "maya@example.com",
        password: "hashedpassword1",
        bio: "Aspiring novelist with a passion for magical realism",
        avatar: null,
        followers: null,
        following: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      },
      {
        username: "urban_scribe",
        email: "alex@example.com", 
        password: "hashedpassword2",
        bio: "Urban fantasy writer exploring modern mythology",
        avatar: null,
        followers: null,
        following: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      },
      {
        username: "cosmic_dreamer",
        email: "zara@example.com",
        password: "hashedpassword3", 
        bio: "Science fiction enthusiast crafting tales of distant worlds",
        avatar: null,
        followers: null,
        following: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      }
    ]).returning();

    // Create stories
    await db.insert(stories).values([
      {
        title: "The Whispering Garden",
        content: "In the heart of the old city, where cobblestones remembered the footsteps of centuries, there existed a garden that most people walked past without noticing. It wasn't that the garden was hidden—quite the opposite. It sat in plain sight, nestled between a bustling café and a vintage bookstore, its wrought iron gates always standing open in invitation. But gardens, you see, choose their visitors as much as visitors choose them.",
        excerpt: "In the heart of the old city, where cobblestones remembered the footsteps of centuries, there existed a garden that most people walked past without noticing...",
        authorId: user1.id,
        status: "published",
        mood: "contemplative",
        readTime: 15,
        wordCount: 2847,
        views: 245,
        likes: null,
        comments: null,
        coverImage: null,
        tags: null,
        featured: false,
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: "City of Tomorrow", 
        content: "In 2087, when humans and AI coexist in Neo-Tokyo, a young detective uncovers a conspiracy that threatens the delicate balance between organic and artificial intelligence. The neon-lit streets pulse with data streams visible only to those with neural implants, and Detective Kira Chen finds herself caught between two worlds as she investigates a series of mysterious disappearances in the digital underground.",
        excerpt: "In 2087, when humans and AI coexist in Neo-Tokyo, a young detective uncovers a conspiracy...",
        authorId: user2.id,
        status: "published",
        mood: "mysterious", 
        readTime: 8,
        wordCount: 156,
        views: 432,
        likes: null,
        comments: null,
        coverImage: null,
        tags: null,
        featured: false,
        publishedAt: new Date('2024-01-10'),
      },
      {
        title: "The Librarian's Secret",
        content: "Eleanor had been the head librarian of the Rosewood Public Library for thirty-seven years, and in all that time, she had never once mentioned the door behind the mythology section. It wasn't that she was deliberately keeping it secret—rather, the door seemed to keep itself hidden, appearing only to those who needed to find it most.",
        excerpt: "Eleanor had been the head librarian for thirty-seven years, and in all that time, she had never once mentioned the door behind the mythology section...",
        authorId: user3.id,
        status: "published",
        mood: "heartwarming",
        readTime: 12,
        wordCount: 1847,
        views: 189,
        likes: null,
        comments: null,
        coverImage: null,
        tags: null,
        featured: false,
        publishedAt: new Date('2024-01-08'),
      }
    ]);

    // Create an active challenge
    await db.insert(challenges).values([
      {
        title: "A Letter Never Sent",
        description: "Write a story about a letter that was written but never sent, and the impact it has when it's finally discovered.",
        prompt: "Sometimes the most important words are the ones we never share. Write about a letter that was meant to be sent but wasn't—what it contained, why it was kept secret, and what happens when someone finally finds it.",
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'), 
        isActive: true,
        submissions: null,
      }
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}