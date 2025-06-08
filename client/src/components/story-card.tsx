import { Heart, MessageCircle, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";

interface StoryCardProps {
  story: {
    id: number;
    title: string;
    excerpt: string;
    coverImage?: string;
    readTime: number;
    likes: number;
    comments: number;
    views: number;
    mood?: string;
    publishedAt: string;
    author?: {
      id: number;
      username: string;
      avatar?: string;
    };
  };
}

export default function StoryCard({ story }: StoryCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "uplifting": return "bg-success/10 text-success border-success/20";
      case "reflective": return "bg-warning/10 text-warning border-warning/20";
      case "adventure": return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300";
      case "romance": return "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300";
      case "mystery": return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
      case "sci-fi": return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Link href={`/story/${story.id}`}>
      <Card className="story-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg cursor-pointer">
        {story.coverImage && (
          <img 
            src={story.coverImage} 
            alt={story.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        )}
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                {story.author?.avatar || story.author?.username?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {story.author?.username || "Anonymous"}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimeAgo(story.publishedAt)}
              </p>
            </div>
          </div>
          
          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3 leading-tight line-clamp-2">
            {story.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {story.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{story.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{story.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{story.comments}</span>
                </div>
              </div>
            </div>
            
            {story.mood && (
              <Badge 
                variant="outline" 
                className={`text-xs font-medium capitalize ${getMoodColor(story.mood)}`}
              >
                {story.mood}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
