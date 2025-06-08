import { useQuery } from "@tanstack/react-query";
import { Trophy, Users, Calendar, Star, Award, Flame, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock current user ID
const CURRENT_USER_ID = 1;

export default function Community() {
  const { data: activeChallenge } = useQuery({
    queryKey: ["/api/challenges/active"],
  });

  const { data: userAchievements } = useQuery({
    queryKey: [`/api/users/${CURRENT_USER_ID}/achievements`],
  });

  // Mock data for demonstration
  const mockAchievements = [
    {
      id: 1,
      type: "first_story",
      title: "First Story",
      description: "Published your debut",
      icon: "pen",
      unlocked: true
    },
    {
      id: 2,
      type: "loved",
      title: "Loved",
      description: "100+ hearts received",
      icon: "heart",
      unlocked: true
    },
    {
      id: 3,
      type: "helpful",
      title: "Helpful",
      description: "10 peer reviews given",
      icon: "users",
      unlocked: true
    },
    {
      id: 4,
      type: "on_fire",
      title: "On Fire",
      description: "7-day writing streak",
      icon: "flame",
      unlocked: false
    },
    {
      id: 5,
      type: "champion",
      title: "Champion",
      description: "Win a weekly challenge",
      icon: "trophy",
      unlocked: false
    },
    {
      id: 6,
      type: "rising_star",
      title: "Rising Star",
      description: "1000+ followers",
      icon: "star",
      unlocked: false
    }
  ];

  const mockChallengeSubmissions = [
    {
      id: 1,
      author: "Sarah Chen",
      title: "Dear Yesterday Me",
      votes: 89,
      position: 1
    },
    {
      id: 2,
      author: "Mike Rodriguez",
      title: "The Unopened Envelope",
      votes: 76,
      position: 2
    },
    {
      id: 3,
      author: "Emma Taylor",
      title: "Words Left Unsaid",
      votes: 64,
      position: 3
    }
  ];

  const mockPendingReviews = [
    {
      id: 1,
      title: "Midnight in Paris",
      author: "Jamie Wilson",
      excerpt: "A romantic tale set in the City of Light...",
      dueDate: "2 days",
      status: "pending"
    },
    {
      id: 2,
      title: "The Digital Nomad",
      author: "Alex Park",
      excerpt: "Working remotely from Bali sounds perfect until...",
      dueDate: "completed",
      status: "completed"
    }
  ];

  const getAchievementIcon = (icon: string, unlocked: boolean) => {
    const iconClass = `w-6 h-6 ${unlocked ? 'text-white' : 'text-gray-500'}`;
    const bgClass = unlocked
      ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
      : "bg-gray-300";

    const IconComponent = {
      pen: Award,
      heart: Trophy,
      users: Users,
      flame: Flame,
      trophy: Trophy,
      star: Star
    }[icon] || Star;

    return (
      <div className={`w-16 h-16 ${bgClass} rounded-full flex items-center justify-center mb-3`}>
        <IconComponent className={iconClass} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Community</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Connect with fellow storytellers, get feedback on your work, and participate in creative challenges.
          </p>
        </div>

        <Tabs defaultValue="challenges" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="reviews">Peer Reviews</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-8">
            {/* Active Challenge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Trophy className="text-accent w-6 h-6" />
                    <span>Weekly Challenge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeChallenge ? (
                    <div>
                      <h3 className="text-lg font-serif font-bold mb-3">
                        "{activeChallenge.title}"
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {activeChallenge.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Ends in 4 days</span>
                        <span>{activeChallenge.submissions} submissions</span>
                      </div>
                      <Button className="w-full bg-accent hover:bg-accent/90">
                        Join Challenge
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No active challenge at the moment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockChallengeSubmissions.map((submission) => (
                      <div key={submission.id} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          submission.position === 1 ? 'bg-yellow-500' : 
                          submission.position === 2 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {submission.position}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">"{submission.title}"</div>
                          <div className="text-sm text-gray-500">by {submission.author}</div>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Trophy className="w-4 h-4" />
                          <span>{submission.votes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Challenge History */}
            <Card>
              <CardHeader>
                <CardTitle>Previous Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4" />
                  <p>Challenge history will appear here as more challenges are completed.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-8">
            {/* Review Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-success mb-2">12</div>
                  <div className="text-gray-600 dark:text-gray-300">Reviews Given</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">8</div>
                  <div className="text-gray-600 dark:text-gray-300">Reviews Received</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-warning mb-2">4.8</div>
                  <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
                </CardContent>
              </Card>
            </div>

            {/* Peer Review System */}
            <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Users className="text-success w-6 h-6" />
                  <span>Peer Review Circle</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get constructive feedback from fellow writers. Share your draft and receive thoughtful reviews to help improve your storytelling.
                </p>
                <Button className="w-full bg-success hover:bg-success/90 mb-6">
                  Share Your Story for Review
                </Button>

                <div className="space-y-4">
                  <h4 className="font-semibold">Pending Reviews</h4>
                  {mockPendingReviews.map((review) => (
                    <Card key={review.id} className="border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">"{review.title}" by {review.author}</h5>
                          <Badge variant={review.status === "completed" ? "default" : "secondary"}>
                            {review.status === "completed" ? "Completed" : `Due in ${review.dueDate}`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {review.excerpt}
                        </p>
                        {review.status === "pending" ? (
                          <Button size="sm" variant="outline">
                            Start Review
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-500">Review Submitted</span>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {mockAchievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`text-center ${achievement.unlocked ? '' : 'opacity-50'}`}
                    >
                      {getAchievementIcon(achievement.icon, achievement.unlocked)}
                      <h4 className="font-semibold text-sm mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress towards next achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>7-day writing streak</span>
                    <span>3/7 days</span>
                  </div>
                  <Progress value={43} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Challenge wins</span>
                    <span>0/1 wins</span>
                  </div>
                  <Progress value={0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Followers</span>
                    <span>234/1000</span>
                  </div>
                  <Progress value={23} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
