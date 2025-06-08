import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Eye, Heart, Users, DollarSign, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock current user ID
const CURRENT_USER_ID = 1;

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: [`/api/users/${CURRENT_USER_ID}/analytics`],
  });

  // Mock chart data for demonstration
  const mockChartData = {
    dailyReads: [
      { date: "2024-01-01", reads: 45 },
      { date: "2024-01-02", reads: 67 },
      { date: "2024-01-03", reads: 89 },
      { date: "2024-01-04", reads: 123 },
      { date: "2024-01-05", reads: 156 },
      { date: "2024-01-06", reads: 134 },
      { date: "2024-01-07", reads: 178 }
    ],
    demographics: {
      age: { "18-24": 25, "25-34": 35, "35-44": 25, "45+": 15 },
      location: { "US": 45, "UK": 20, "Canada": 15, "Other": 20 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Your Impact</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Track how your stories resonate with readers and grow your audience.
            </p>
          </div>
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {analytics?.totalReads?.toLocaleString() || "0"}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-1">Total Reads</div>
              <div className="text-sm text-success">+23% this month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4 mx-auto">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl font-bold text-accent mb-2">
                {analytics?.totalHearts?.toLocaleString() || "0"}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-1">Hearts Received</div>
              <div className="text-sm text-success">+18% this month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mb-4 mx-auto">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div className="text-3xl font-bold text-success mb-2">
                {analytics?.followers?.toLocaleString() || "0"}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-1">Followers</div>
              <div className="text-sm text-success">+12% this month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg mb-4 mx-auto">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
              <div className="text-3xl font-bold text-warning mb-2">
                ${analytics?.earnings?.toFixed(2) || "0.00"}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-1">Tips Received</div>
              <div className="text-sm text-success">+34% this month</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reading Analytics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Reading Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                      <p className="font-medium">Interactive chart showing daily/weekly/monthly reads</p>
                      <p className="text-sm mt-2">Peak reading time: 8-10 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Stories */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.topStories?.slice(0, 5).map((story: any, index: number) => (
                      <div key={story.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {story.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Published {new Date(story.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {story.views?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">reads</div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Eye className="w-12 h-12 mx-auto mb-4" />
                        <p>No story data available yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Story Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topStories?.map((story: any) => (
                    <div key={story.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-serif font-bold text-lg">{story.title}</h3>
                        <Badge variant={story.status === "published" ? "default" : "secondary"}>
                          {story.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{story.views}</div>
                          <div className="text-sm text-gray-500">Views</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-accent">{story.likes}</div>
                          <div className="text-sm text-gray-500">Hearts</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-success">{story.comments}</div>
                          <div className="text-sm text-gray-500">Comments</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-warning">
                            {((story.likes / story.views) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-500">Engagement</div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4" />
                      <p>Start publishing stories to see performance data.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Reader Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4" />
                      <p className="font-medium">Audience demographics chart</p>
                      <p className="text-sm mt-2">Age groups, locations, reading preferences</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reading Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Peak Reading Hours</span>
                        <span className="font-medium">8-10 PM</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Session Duration</span>
                        <span className="font-medium">12 minutes</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Return Rate</span>
                        <span className="font-medium">68%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Most Popular Mood</span>
                        <span className="font-medium">Reflective</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-8">
            {/* Tip Jar Integration */}
            <Card className="bg-gradient-to-br from-warning/10 to-orange-100 dark:from-warning/5 dark:to-orange-900/20 border-warning/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-warning" />
                  <span>Tip Jar Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">
                      ${analytics?.earnings?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Total Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">23</div>
                    <div className="text-gray-600 dark:text-gray-300">Tips Received</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">$6.78</div>
                    <div className="text-gray-600 dark:text-gray-300">Average Tip</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-warning hover:bg-warning/90">
                    Enable Tip Jar
                  </Button>
                  <Button variant="outline" className="border-warning text-warning hover:bg-warning/10">
                    Withdraw Earnings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4" />
                  <p>Earnings history will appear here as you receive tips.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
