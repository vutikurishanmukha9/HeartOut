import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Share2, Coffee, Type, Palette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface ReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: {
    id: number;
    title: string;
    content: string;
    readTime: number;
    author?: {
      username: string;
      avatar?: string;
    };
  };
  onLike: () => void;
  likeStatus?: {
    hasLiked: boolean;
    likeCount: number;
  };
}

export default function ReadingModal({ 
  isOpen, 
  onClose, 
  story, 
  onLike, 
  likeStatus 
}: ReadingModalProps) {
  const [fontSize, setFontSize] = useState(18);
  const [showSettings, setShowSettings] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setReadingProgress(Math.min(100, Math.max(0, progress)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: `Check out this story: ${story.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-full h-full m-0 p-0 bg-black text-white">
        <div className="h-full flex flex-col">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white">
                      {story.author?.avatar || story.author?.username?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{story.author?.username}</div>
                    <div className="text-sm text-gray-300">{story.readTime} min read</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                  className="text-white hover:bg-white/10"
                >
                  <Type className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHighContrast(!highContrast)}
                  className="text-white hover:bg-white/10"
                >
                  <Palette className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Story Content */}
          <div 
            className="flex-1 overflow-auto"
            onScroll={handleScroll}
          >
            <div className="max-w-4xl mx-auto px-6 py-8">
              <article className={`prose prose-lg prose-invert max-w-none ${highContrast ? 'prose-invert-high-contrast' : ''}`}>
                <h1 
                  className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight"
                  style={{ fontSize: `${fontSize * 1.5}px` }}
                >
                  {story.title}
                </h1>
                
                <div 
                  className="prose-reading whitespace-pre-wrap font-serif leading-relaxed"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
                >
                  {story.content}
                </div>
              </article>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-700 p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  onClick={onLike}
                  className={`flex items-center space-x-2 text-white hover:text-accent ${
                    likeStatus?.hasLiked ? 'text-accent' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likeStatus?.hasLiked ? 'fill-current' : ''}`} />
                  <span>{likeStatus?.likeCount || 0}</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-primary">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-success">
                  <Coffee className="w-4 h-4" />
                  <span>Tip</span>
                </Button>
              </div>
              <div className="text-gray-400 text-sm">
                Progress: {Math.round(readingProgress)}%
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
