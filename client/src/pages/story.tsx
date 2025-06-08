import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2, BookmarkPlus, ArrowLeft, User, Clock, Eye, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ReadingModal from "@/components/reading-modal";
import TipJar from "@/components/tip-jar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { Link } from "wouter";

// Mock current user - in real app this would come from auth context
const CURRENT_USER_ID = 1;

export default function Story() {
  const params = useParams();
  const storyId = parseInt(params?.id || "0");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showTipJar, setShowTipJar] = useState(false);

  // WebSocket for real-time updates
  const { sendMessage } = useWebSocket((data) => {
    if (data.type === 'comment_added' && data.storyId === storyId) {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}/comments`] });
    }
    if (data.type === 'story_liked' && data.storyId === storyId) {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}/like-status/${CURRENT_USER_ID}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}`] });
    }
  });

  const { data: story, isLoading } = useQuery({
    queryKey: [`/api/stories/${storyId}`],
  });

  const { data: comments } = useQuery({
    queryKey: [`/api/stories/${storyId}/comments`],
  });

  const { data: likeStatus } = useQuery({
    queryKey: [`/api/stories/${storyId}/like-status/${CURRENT_USER_ID}`],
  });

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/stories/${storyId}/like`, { userId: CURRENT_USER_ID }),
    onSuccess: (response) => {
      const result = response.json();
      queryClient.setQueryData([`/api/stories/${storyId}/like-status/${CURRENT_USER_ID}`], result);
      sendMessage({ 
        type: 'story_like', 
        storyId, 
        likeCount: result.likeCount 
      });
      toast({ 
        title: result.liked ? "Story liked!" : "Like removed",
        description: result.liked ? "Thanks for showing your appreciation!" : "Like removed from story"
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => 
      apiRequest("POST", `/api/stories/${storyId}/comments`, { 
        content, 
        userId: CURRENT_USER_ID 
      }),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${storyId}/comments`] });
      sendMessage({ 
        type: 'new_comment', 
        storyId,
        comment: { content: newComment, userId: CURRENT_USER_ID }
      });
      toast({ title: "Comment posted!" });
    },
  });

  useEffect(() => {
    if (storyId) {
      sendMessage({ type: 'join_story', storyId });
    }
  }, [storyId, sendMessage]);

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

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Story not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment.trim());
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Button>
        </Link>

        {/* Story Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-white">
                  {story.author?.avatar || story.author?.username?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{story.author?.username}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{story.author?.bio}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {story.readTime} min read
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {story.views} views
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <Badge variant="secondary">{story.mood}</Badge>
              <div className="text-sm text-gray-500">
                Published {new Date(story.publishedAt).toLocaleDateString()}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              {story.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {story.excerpt}
            </p>
          </CardContent>
        </Card>

        {/* Story Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
                {story.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant={likeStatus?.hasLiked ? "default" : "outline"}
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  <Heart className={`w-4 h-4 ${likeStatus?.hasLiked ? 'fill-current' : ''}`} />
                  <span>{likeStatus?.likeCount || 0}</span>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments?.length || 0}</span>
                </Button>

                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                <Button variant="outline">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowTipJar(true)}
                  className="flex items-center space-x-2"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Tip Author</span>
                </Button>

                <Button onClick={() => setShowReadingModal(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Immersive Mode
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-6">Comments ({comments?.length || 0})</h3>

            {/* Add Comment */}
            <div className="mb-6">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this story..."
                className="mb-3"
              />
              <Button 
                onClick={handleComment}
                disabled={!newComment.trim() || commentMutation.isPending}
              >
                Post Comment
              </Button>
            </div>

            <Separator className="mb-6" />

            {/* Comments List */}
            <div className="space-y-6">
              {comments?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments?.map((comment: any) => (
                  <div key={comment.id} className="flex space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                        {comment.user?.avatar || comment.user?.username?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{comment.user?.username}</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* More Stories from Author */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-serif">
            More from {story.author?.username}
          </h3>
          <div className="text-center py-8">
            <p className="text-gray-500">More stories coming soon...</p>
          </div>
        </div>
      </div>

      {/* Reading Modal */}
      <ReadingModal
        isOpen={showReadingModal}
        onClose={() => setShowReadingModal(false)}
        story={story}
        onLike={handleLike}
        likeStatus={likeStatus}
      />

      {/* Tip Jar Modal */}
      <TipJar
        isOpen={showTipJar}
        onClose={() => setShowTipJar(false)}
        story={story}
        author={story.author}
      />
    </div>
  );
}
