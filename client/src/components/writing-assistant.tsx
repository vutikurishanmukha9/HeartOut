import { useState } from "react";
import { Bot, Lightbulb, Target, Zap, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  id: string;
  type: "tip" | "tone" | "structure" | "grammar";
  title: string;
  content: string;
  action?: string;
}

export default function WritingAssistant() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      type: "tip",
      title: "Sensory Details",
      content: "Consider adding more sensory details to help readers visualize the rain scene. What does it sound like? How does it feel?",
      action: "Apply suggestion"
    },
    {
      id: "2", 
      type: "tone",
      title: "Tone Check",
      content: "Your story has a mysterious, contemplative tone. This works well for your target audience interested in reflective narratives.",
    },
    {
      id: "3",
      type: "structure",
      title: "Pacing Suggestion",
      content: "Consider breaking up this longer paragraph into shorter ones to improve readability and pacing.",
      action: "Auto-format"
    }
  ]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "tip": return <Lightbulb className="w-4 h-4 text-primary" />;
      case "tone": return <Target className="w-4 h-4 text-accent" />;
      case "structure": return <Zap className="w-4 h-4 text-success" />;
      case "grammar": return <CheckCircle className="w-4 h-4 text-warning" />;
      default: return <Bot className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "tip": return "border-primary/20 bg-primary/5";
      case "tone": return "border-accent/20 bg-accent/5";
      case "structure": return "border-success/20 bg-success/5";
      case "grammar": return "border-warning/20 bg-warning/5";
      default: return "border-gray/20 bg-gray/5";
    }
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  const applySuggestion = (id: string) => {
    // In a real app, this would apply the suggestion to the text
    dismissSuggestion(id);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-primary" />
          <span>Writing Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="text-center py-6">
            <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              No suggestions at the moment. Keep writing to get personalized feedback!
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

        {/* Writing Tips */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">Quick Tips</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
              <Zap className="w-3 h-3 text-success" />
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
