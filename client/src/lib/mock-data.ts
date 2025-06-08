export const mockStories = [
  {
    id: 1,
    title: "Finding Peace in the Mountains",
    excerpt: "A journey of self-discovery through hiking the Appalachian Trail, where every step brought me closer to understanding what truly matters in life...",
    content: `The trail stretched endlessly ahead, winding through ancient pines that seemed to whisper secrets of the centuries. Each step took me further from the chaos of the city and deeper into something I hadn't felt in years—silence.

Not the kind of silence you get from noise-canceling headphones or a quiet room. This was different. This was the silence of space, of perspective, of realizing just how small your problems really are when you're standing in the shadow of something that's been here for millions of years.

I'd started this hike three months after losing my job, two weeks after my relationship ended, and one day after realizing I had no idea who I was anymore. The Appalachian Trail seemed like the perfect place to figure it out—or at least to get lost trying.

Day by day, mile by mile, I began to understand something my therapist had been trying to tell me for months: sometimes you have to lose yourself completely to find out who you really are.

The mountains don't care about your deadlines, your breakups, or your bank account. They only care that you keep putting one foot in front of the other.

Three weeks in, I met Sarah at a trail shelter. She was seventy-three, hiking alone, and had been doing sections of the trail for fifteen years. "Why?" I asked her over instant coffee and freeze-dried pasta.

"Because," she said, gesturing to the star-filled sky above us, "this is where I remember who I am when the world tries to make me forget."

That night, I understood. The peace I'd been searching for wasn't something I needed to find. It was something I needed to remember. It had been there all along, buried under years of noise and expectation and the constant need to be someone else's version of successful.

I finished my section hike six weeks later, but I left the mountains with something more valuable than any job or relationship could ever give me: the knowledge that I am enough, exactly as I am, in this moment.

The city is still chaotic when I return to it. But now I carry a piece of that mountain silence with me everywhere I go.`,
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
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 1,
      username: "emily_watson",
      avatar: "EM",
      bio: "Nature lover and outdoor enthusiast"
    }
  },
  {
    id: 2,
    title: "The Coffee Shop at 3 AM",
    excerpt: "There's something magical about the only 24-hour coffee shop in town, where night owls and early birds cross paths in the most unexpected ways...",
    content: `There's something magical about the only 24-hour coffee shop in town, where night owls and early birds cross paths in the most unexpected ways...`,
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
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 2,
      username: "marcus_kim",
      avatar: "MK",
      bio: "Coffee connoisseur and night owl"
    }
  }
];

export const mockUsers = [
  {
    id: 1,
    username: "emily_watson",
    email: "emily@example.com",
    avatar: "EM",
    bio: "Nature lover and outdoor enthusiast",
    followers: 234,
    following: 45
  },
  {
    id: 2,
    username: "marcus_kim", 
    email: "marcus@example.com",
    avatar: "MK",
    bio: "Coffee connoisseur and night owl",
    followers: 156,
    following: 32
  }
];

export const mockComments = [
  {
    id: 1,
    storyId: 1,
    userId: 2,
    content: "This really resonated with me. I've been thinking about taking a solo hiking trip myself.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 2,
      username: "marcus_kim",
      avatar: "MK"
    }
  }
];

export const mockAnalytics = {
  totalReads: 12456,
  totalHearts: 2847,
  followers: 1234,
  earnings: 156.50,
  storiesCount: 5,
  topStories: mockStories
};
