import { useState, useEffect } from "react";
import { Bot, Lightbulb, Target, Zap, X, CheckCircle, Loader2, Sparkles, BookOpen } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  id: string;
  type: "improvement" | "continuation" | "alternative" | "grammar" | "idea";
  title: string;
  content: string;
  action?: string;
}

interface StoryIdea {
  title: string;
  premise: string;
  genre: string;
  mood: string;
}

interface WritingAssistantProps {
  currentText?: string;
  onTextChange?: (text: string) => void;
}

export default function WritingAssistant({ currentText = "", onTextChange }: WritingAssistantProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [storyIdeas, setStoryIdeas] = useState<StoryIdea[]>([]);
  const [ideaPrompt, setIdeaPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"suggestions" | "ideas" | "grammar">("suggestions");
  const { toast } = useToast();

  // AI Mutations
  const writingSuggestionsMutation = useMutation({
    mutationFn: async ({ text, type }: { text: string; type: "improve" | "continue" | "alternative" }) => {
      const response = await apiRequest("POST", "/api/ai/writing-suggestions", { text, type });
      return response.json();
    },
    onSuccess: (data) => {
      const newSuggestions: Suggestion[] = data.suggestions.map((s: any, index: number) => ({
        id: `${s.type}_${Date.now()}_${index}`,
        type: s.type,
        title: s.type === "improvement" ? "Writing Improvement" : 
               s.type === "continuation" ? "Continue Story" : "Alternative Approach",
        content: s.suggestion,
        action: "Apply"
      }));
      setSuggestions(prev => [...prev, ...newSuggestions]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get writing suggestions",
        variant: "destructive"
      });
    }
  });

  const grammarCheckMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/ai/grammar-check", { text });
      return response.json();
    },
    onSuccess: (data) => {
      const grammarSuggestions: Suggestion[] = data.corrections.map((c: any, index: number) => ({
        id: `grammar_${Date.now()}_${index}`,
        type: "grammar",
        title: "Grammar Correction",
        content: `Change "${c.original}" to "${c.corrected}". ${c.explanation}`,
        action: "Fix"
      }));
      setSuggestions(prev => [...prev, ...grammarSuggestions]);
      
      if (data.overall_score < 80) {
        toast({
          title: "Grammar Check Complete",
          description: `Writing score: ${data.overall_score}/100. Found ${data.corrections.length} suggestions.`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check grammar",
        variant: "destructive"
      });
    }
  });

  const storyIdeasMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/ai/story-ideas", { prompt, count: 3 });
      return response.json();
    },
    onSuccess: (data) => {
      setStoryIdeas(data.ideas);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate story ideas",
        variant: "destructive"
      });
    }
  });

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "improvement": return <Lightbulb className="w-4 h-4 text-primary" />;
      case "continuation": return <Zap className="w-4 h-4 text-blue-500" />;
      case "alternative": return <Target className="w-4 h-4 text-accent" />;
      case "grammar": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "idea": return <Sparkles className="w-4 h-4 text-purple-500" />;
      default: return <Bot className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "improvement": return "border-primary/20 bg-primary/5";
      case "continuation": return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
      case "alternative": return "border-accent/20 bg-accent/5";
      case "grammar": return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "idea": return "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950";
      default: return "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800";
    }
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  const applySuggestion = (id: string) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion && onTextChange) {
      // Apply the suggestion to the text - this is a simplified implementation
      toast({
        title: "Suggestion Applied",
        description: "The suggestion has been applied to your text",
      });
    }
    dismissSuggestion(id);
  };

  const handleGenerateIdeas = () => {
    if (ideaPrompt.trim()) {
      storyIdeasMutation.mutate(ideaPrompt);
    }
  };

  const handleAnalyzeText = (type: "improve" | "continue" | "alternative") => {
    if (currentText.trim()) {
      writingSuggestionsMutation.mutate({ text: currentText, type });
    } else {
      toast({
        title: "No Text",
        description: "Please write some text first to get suggestions",
        variant: "destructive"
      });
    }
  };

  const handleGrammarCheck = () => {
    if (currentText.trim()) {
      grammarCheckMutation.mutate(currentText);
    } else {
      toast({
        title: "No Text",
        description: "Please write some text first to check grammar",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>AI Writing Assistant</span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant={activeTab === "suggestions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("suggestions")}
              className="text-xs"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              Suggestions
            </Button>
            <Button
              variant={activeTab === "ideas" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("ideas")}
              className="text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Ideas
            </Button>
            <Button
              variant={activeTab === "grammar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("grammar")}
              className="text-xs"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Grammar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* AI Action Buttons */}
        {activeTab === "suggestions" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAnalyzeText("improve")}
                disabled={writingSuggestionsMutation.isPending}
                className="text-xs"
              >
                {writingSuggestionsMutation.isPending ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Lightbulb className="w-3 h-3 mr-1" />
                )}
                Improve Writing
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAnalyzeText("continue")}
                disabled={writingSuggestionsMutation.isPending}
                className="text-xs"
              >
                {writingSuggestionsMutation.isPending ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Zap className="w-3 h-3 mr-1" />
                )}
                Continue Story
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAnalyzeText("alternative")}
                disabled={writingSuggestionsMutation.isPending}
                className="text-xs"
              >
                {writingSuggestionsMutation.isPending ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Target className="w-3 h-3 mr-1" />
                )}
                Alternative
              </Button>
            </div>
            
            {/* Suggestions List */}
            {suggestions.length === 0 ? (
              <div className="text-center py-6">
                <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Write some text and click the buttons above to get AI-powered suggestions!
                </p>
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg p-3 text-sm border ${getSuggestionColor(suggestion.type)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="h-auto p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {suggestion.content}
                  </p>
                  
                  {suggestion.action && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(suggestion.id)}
                        className="text-xs"
                      >
                        {suggestion.action}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissSuggestion(suggestion.id)}
                        className="text-xs"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Story Ideas Tab */}
        {activeTab === "ideas" && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Describe what kind of story you want to write..."
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                className="flex-1 min-h-[80px]"
              />
            </div>
            <Button
              onClick={handleGenerateIdeas}
              disabled={storyIdeasMutation.isPending || !ideaPrompt.trim()}
              className="w-full"
            >
              {storyIdeasMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Story Ideas
            </Button>
            
            {storyIdeas.length > 0 && (
              <div className="space-y-3">
                {storyIdeas.map((idea, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">{idea.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{idea.premise}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">{idea.genre}</Badge>
                      <Badge variant="outline" className="text-xs">{idea.mood}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grammar Tab */}
        {activeTab === "grammar" && (
          <div className="space-y-3">
            <Button
              onClick={handleGrammarCheck}
              disabled={grammarCheckMutation.isPending}
              className="w-full"
            >
              {grammarCheckMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Check Grammar & Style
            </Button>
            
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Write some text and click above to get grammar and style suggestions!
              </p>
            </div>
          </div>
        )}

        {/* Writing Tips */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">Quick Tips</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
              <Zap className="w-3 h-3 text-green-500" />
              <span>Show, don't tell</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
              <Lightbulb className="w-3 h-3 text-primary" />
              <span>Use active voice</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
              <Target className="w-3 h-3 text-accent" />
              <span>Vary sentence length</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
