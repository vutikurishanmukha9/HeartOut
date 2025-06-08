import { useQuery } from "@tanstack/react-query";
import { Heart, Search, Bell, ChevronRight, ArrowRight, Coffee, Trophy, Users, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StoryCard from "@/components/story-card";
import AIStoryGenerator from "@/components/ai-story-generator";
import { Link } from "wouter";

export default function Home() {
  const { data: featuredStories, isLoading: loadingFeatured } = useQuery({
    queryKey: ["/api/stories/featured"],
  });

  const { data: allStories, isLoading: loadingAll } = useQuery({
    queryKey: ["/api/stories"],
  });

  const { data: activeChallenge } = useQuery({
    queryKey: ["/api/challenges/active"],
  });

  const moods = [
    { name: "All", active: true },
    { name: "Uplifting", active: false },
    { name: "Reflective", active: false },
    { name: "Adventure", active: false },
    { name: "Romance", active: false },
    { name: "Mystery", active: false },
    { name: "Sci-Fi", active: false },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-creative-gradient text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
              Where Stories <span className="text-accent-300">Come Alive</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
              Share your voice, discover untold stories, and connect with a community of passionate storytellers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/editor">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-semibold">
                  Start Writing
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                Explore Stories
              </Button>
            </div>
          </div>

          {/* Featured Stories */}
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 text-center">Featured Stories</h2>
            {loadingFeatured ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                    <div className="h-32 bg-white/20 rounded-xl mb-4"></div>
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredStories?.slice(0, 3).map((story: any) => (
                  <Link key={story.id} href={`/story/${story.id}`}>
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                            {story.author?.avatar || story.author?.username?.[0]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{story.author?.username}</h4>
                            <p className="text-sm text-gray-300">{story.readTime} min read</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-serif font-bold mb-3 text-white">{story.title}</h3>
                        <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">{story.excerpt}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span className="flex items-center"><Heart className="w-4 h-4 mr-1" />{story.likes}</span>
                            <span>{story.comments} comments</span>
                          </div>
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {story.mood}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Story Generator Section */}
      <section className="py-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-serif">AI Story Ideas</h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stuck for inspiration? Let our AI generate unique story concepts tailored to your creative vision.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <AIStoryGenerator />
          </div>
        </div>
      </section>

      {/* Discovery Feed */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Discover Stories</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Find your next favorite story based on your interests and reading history.</p>
            </div>
            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
                <Button size="sm" className="bg-primary text-white">For You</Button>
                <Button size="sm" variant="ghost">Trending</Button>
                <Button size="sm" variant="ghost">Recent</Button>
              </div>
            </div>
          </div>

          {/* Mood Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant={mood.active ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {mood.name}
              </Button>
            ))}
          </div>

          {/* Stories Grid */}
          {loadingAll ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allStories?.map((story: any) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" className="px-8">
              Load More Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Join Our Community</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with fellow storytellers, get feedback on your work, and participate in creative challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Weekly Challenge */}
            <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="text-accent w-6 h-6" />
                  <h3 className="text-xl font-bold">Weekly Challenge</h3>
                </div>
                {activeChallenge ? (
                  <div>
                    <h4 className="font-serif font-bold mb-2">"{activeChallenge.title}"</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{activeChallenge.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Ends in 4 days</span>
                      <span>{activeChallenge.submissions} submissions</span>
                    </div>
                    <Link href="/community">
                      <Button className="w-full bg-accent hover:bg-accent/90">
                        Join Challenge
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">No active challenge at the moment.</p>
                )}
              </CardContent>
            </Card>

            {/* Peer Reviews */}
            <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-success/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="text-success w-6 h-6" />
                  <h3 className="text-xl font-bold">Peer Reviews</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get constructive feedback from fellow writers and help others improve their craft.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">12</div>
                    <div className="text-sm text-gray-500">Reviews Given</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">8</div>
                    <div className="text-sm text-gray-500">Reviews Received</div>
                  </div>
                </div>
                <Link href="/community">
                  <Button className="w-full bg-success hover:bg-success/90">
                    Share Your Story
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="bg-gradient-to-br from-warning/10 to-primary/10 border-warning/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="text-warning w-6 h-6" />
                  <h3 className="text-xl font-bold">Track Your Impact</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  See how your stories resonate with readers and grow your audience.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Reads</span>
                    <span className="font-bold">12,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Hearts Received</span>
                    <span className="font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Followers</span>
                    <span className="font-bold">1,234</span>
                  </div>
                </div>
                <Link href="/analytics">
                  <Button className="w-full bg-warning hover:bg-warning/90">
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tip Jar Section */}
      <section className="py-16 bg-gradient-to-br from-warning/10 to-orange-100 dark:from-warning/5 dark:to-orange-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-warning to-orange-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
            <Coffee />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Support Independent Storytelling</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Enable readers to show appreciation for your work with tips. Every contribution helps support your creative journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-warning hover:bg-warning/90 text-white">
                Enable Tip Jar
              </Button>
            </Link>
            <Link href="/analytics">
              <Button size="lg" variant="outline" className="border-warning text-warning hover:bg-warning/10">
                View Earnings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="text-accent w-8 h-8" />
                <span className="text-2xl font-bold">HearOut</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering storytellers worldwide to share their voices and connect with readers who care about authentic, meaningful narratives.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Writers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/editor" className="hover:text-white transition-colors">Start Writing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Peer Reviews</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Readers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Discover Stories</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reading Lists</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 HearOut. Made with ❤️ for storytellers everywhere.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
