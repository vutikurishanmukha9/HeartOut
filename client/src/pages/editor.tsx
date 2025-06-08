import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Eye, Settings, MoreHorizontal, ArrowLeft, Bold, Italic, Link as LinkIcon, List, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import WritingAssistant from "@/components/writing-assistant";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Editor() {
  const params = useParams();
  const storyId = params?.id ? parseInt(params.id) : null;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [mood, setMood] = useState("");
  const [status, setStatus] = useState("draft");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load existing story if editing
  const { data: story, isLoading } = useQuery({
    queryKey: [`/api/stories/${storyId}`],
    enabled: !!storyId,
  });

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setContent(story.content);
      setExcerpt(story.excerpt);
      setMood(story.mood || "");
      setStatus(story.status);
    }
  }, [story]);

  // Auto-save functionality
  useEffect(() => {
    if (!title && !content) return;

    const autoSaveTimer = setTimeout(() => {
      if (storyId) {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, excerpt, mood, status, storyId]);

  const createStoryMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/stories", data),
    onSuccess: () => {
      setLastSaved(new Date());
      toast({ title: "Story created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating story", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateStoryMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", `/api/stories/${storyId}`, data),
    onSuccess: () => {
      setLastSaved(new Date());
      toast({ title: "Story saved successfully!" });
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}`] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error saving story", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({ 
        title: "Title required", 
        description: "Please enter a title for your story",
        variant: "destructive" 
      });
      return;
    }

    const storyData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.trim().substring(0, 200) + "...",
      mood: mood || "reflective",
      status,
      authorId: 1, // Mock user ID
      readTime: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
      wordCount: content.trim().split(/\s+/).length,
    };

    if (storyId) {
      updateStoryMutation.mutate(storyData);
    } else {
      createStoryMutation.mutate(storyData);
    }
  };

  const handlePublish = () => {
    setStatus("published");
    setTimeout(() => handleSave(), 100);
  };

  const moods = [
    { value: "uplifting", label: "Uplifting" },
    { value: "reflective", label: "Reflective" },
    { value: "adventure", label: "Adventure" },
    { value: "romance", label: "Romance" },
    { value: "mystery", label: "Mystery" },
    { value: "sci-fi", label: "Sci-Fi" },
  ];

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {storyId ? "Edit Story" : "Create New Story"}
              </h1>
              {lastSaved && (
                <p className="text-sm text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={status === "published" ? "default" : "secondary"}>
              {status === "published" ? "Published" : "Draft"}
            </Badge>
            <Button variant="outline" onClick={handleSave} disabled={createStoryMutation.isPending || updateStoryMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            {status === "draft" && (
              <Button onClick={handlePublish} disabled={createStoryMutation.isPending || updateStoryMutation.isPending}>
                Publish Story
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Story Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Story Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your story title..."
                    className="text-lg font-serif"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Mood</label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mood..." />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map((moodOption) => (
                          <SelectItem key={moodOption.value} value={moodOption.value}>
                            {moodOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-gray-500">
                      <div>{wordCount} words</div>
                      <div>{readTime} min read</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Write a brief description of your story..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Text Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Story Content</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Quote className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your story..."
                  className="min-h-[500px] font-serif text-lg leading-relaxed resize-none"
                />
              </CardContent>
            </Card>

            {/* Preview */}
            {content && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <h1 className="font-serif text-3xl font-bold mb-6">{title || "Untitled Story"}</h1>
                    <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
                      {content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Writing Assistant */}
            <WritingAssistant 
              currentText={content}
              onTextChange={setContent}
            />

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Enable comments</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Allow tip jar</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Request peer review</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Story Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Story Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Characters:</span>
                  <span className="font-medium">{content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Words:</span>
                  <span className="font-medium">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Read time:</span>
                  <span className="font-medium">{readTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Paragraphs:</span>
                  <span className="font-medium">{content.split('\n\n').filter(p => p.trim()).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
