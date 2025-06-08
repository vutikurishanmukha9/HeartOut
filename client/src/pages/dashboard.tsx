import { useQuery } from "@tanstack/react-query";
import { Plus, Save, Undo, Redo, GripVertical, MoreHorizontal, Users, Calendar, TrendingUp, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StoryCanvas from "@/components/story-canvas";
import WritingAssistant from "@/components/writing-assistant";
import { Link } from "wouter";

// Mock user ID - in a real app this would come from auth context
const CURRENT_USER_ID = 1;

export default function Dashboard() {
  const { data: userStories } = useQuery({
    queryKey: [`/api/users/${CURRENT_USER_ID}/stories`],
  });

  const { data: analytics } = useQuery({
    queryKey: [`/api/users/${CURRENT_USER_ID}/analytics`],
  });

  const draftStory = {
    id: 1,
    title: "The Journey Within",
    wordCount: 1247,
    targetWords: 2000,
    completion: 75,
    sections: [
      {
        id: 1,
        title: "Opening Scene",
        content: "The rain drummed against the window as Sarah opened the letter that would change everything...",
        wordCount: 247,
        status: "complete",
        lastEdited: "2 hours ago"
      },
      {
        id: 2,
        title: "Character Development", 
        content: "Sarah's background as a former detective becomes crucial to understanding...",
        wordCount: 156,
        status: "in-progress",
        lastEdited: "1 hour ago"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Your Creative Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your stories, track engagement, and unleash your creativity with our intuitive writing tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story Canvas - Main Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Story Canvas</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Redo className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-primary text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StoryCanvas story={draftStory} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Story Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Word Count</span>
                    <span className="font-medium">{draftStory.wordCount} / {draftStory.targetWords}</span>
                  </div>
                  <Progress value={(draftStory.wordCount / draftStory.targetWords) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion</span>
                    <span className="font-medium">{draftStory.completion}%</span>
                  </div>
                  <Progress value={draftStory.completion} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Writing Assistant */}
            <WritingAssistant />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/community">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-3 text-primary" />
                    Share for Peer Review
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-3 text-accent" />
                  Schedule Publish
                </Button>
                <Link href="/analytics">
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-3 text-success" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Stories */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Your Stories</h2>
            <Link href="/editor">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Story
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Draft Story */}
            <Card className="border-dashed border-2 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="border-primary text-primary">Draft</Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">The Journey Within</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  A story about self-discovery and finding peace in unexpected places...
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{draftStory.wordCount} words</span>
                  <span>Last edited 1 hour ago</span>
                </div>
                <div className="mt-4">
                  <Link href="/editor/1">
                    <Button className="w-full">Continue Writing</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Published Stories */}
            {analytics?.topStories?.slice(0, 2).map((story: any) => (
              <Card key={story.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="default" className="bg-success text-white">Published</Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2">{story.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{story.views} views</span>
                    <span>{story.likes} hearts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/story/${story.id}`}>
                      <Button variant="outline" size="sm" className="w-full">View</Button>
                    </Link>
                    <Link href={`/editor/${story.id}`}>
                      <Button variant="outline" size="sm" className="w-full">Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create New Story Card */}
            <Link href="/editor">
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <Plus className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Create New Story</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Start writing your next masterpiece
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {analytics?.totalReads?.toLocaleString() || "0"}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Total Reads</div>
              <div className="text-sm text-success mt-1">+23% this month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {analytics?.totalHearts?.toLocaleString() || "0"}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Hearts Received</div>
              <div className="text-sm text-success mt-1">+18% this month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {analytics?.followers?.toLocaleString() || "0"}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Followers</div>
              <div className="text-sm text-success mt-1">+12% this month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-warning mb-2">
                ${analytics?.earnings?.toFixed(2) || "0.00"}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Tips Received</div>
              <div className="text-sm text-success mt-1">+34% this month</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
