import { useState } from "react";
import { Sparkles, Loader2, RefreshCw, Copy, BookOpen } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface StoryIdea {
  title: string;
  premise: string;
  genre: string;
  mood: string;
  characters: string[];
  themes: string[];
}

interface AIStoryGeneratorProps {
  onSelectIdea?: (idea: StoryIdea) => void;
}

export default function AIStoryGenerator({ onSelectIdea }: AIStoryGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [ideas, setIdeas] = useState<StoryIdea[]>([]);
  const { toast } = useToast();

  const generateIdeasMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/ai/story-ideas", { prompt, count: 3 });
      return response.json();
    },
    onSuccess: (data) => {
      setIdeas(data.ideas);
      toast({
        title: "Story Ideas Generated",
        description: `Generated ${data.ideas.length} unique story concepts for you!`,
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate story ideas. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleGenerate = () => {
    if (prompt.trim()) {
      generateIdeasMutation.mutate(prompt);
    } else {
      toast({
        title: "Prompt Required",
        description: "Please describe what kind of story you'd like to write.",
        variant: "destructive"
      });
    }
  };

  const handleCopyIdea = (idea: StoryIdea) => {
    const text = `Title: ${idea.title}\n\nPremise: ${idea.premise}\n\nGenre: ${idea.genre}\nMood: ${idea.mood}\n\nCharacters: ${idea.characters.join(", ")}\nThemes: ${idea.themes.join(", ")}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Story idea has been copied to your clipboard",
    });
  };

  const handleUseIdea = (idea: StoryIdea) => {
    if (onSelectIdea) {
      onSelectIdea(idea);
    } else {
      // Navigate to editor with the idea pre-filled
      const storyData = {
        title: idea.title,
        content: `# ${idea.title}\n\n${idea.premise}\n\n*Genre: ${idea.genre}*\n*Mood: ${idea.mood}*\n\n## Characters\n${idea.characters.map(char => `- ${char}`).join('\n')}\n\n## Themes\n${idea.themes.map(theme => `- ${theme}`).join('\n')}\n\n---\n\nStart writing your story here...`,
        mood: idea.mood
      };
      
      // Store in sessionStorage to pass to editor
      sessionStorage.setItem('newStoryData', JSON.stringify(storyData));
      window.location.href = '/editor';
    }
  };

  const promptSuggestions = [
    "A mysterious object falls from the sky in a small town",
    "Two strangers meet during a power outage",
    "A person discovers they can hear other people's thoughts",
    "A time traveler gets stuck in the wrong century",
    "A detective investigating supernatural crimes",
    "A world where emotions have physical forms"
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>AI Story Generator</span>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Get AI-powered story ideas to spark your creativity
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            What kind of story would you like to write?
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the genre, setting, themes, or any specific elements you want in your story..."
            className="min-h-[100px]"
          />
          
          {/* Quick Prompts */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Try these prompts:</p>
            <div className="flex flex-wrap gap-1">
              {promptSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs h-auto py-1 px-2"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generateIdeasMutation.isPending || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {generateIdeasMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          Generate Story Ideas
        </Button>

        {/* Generated Ideas */}
        {ideas.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Generated Ideas</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateIdeasMutation.mutate(prompt)}
                disabled={generateIdeasMutation.isPending}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Regenerate
              </Button>
            </div>
            
            {ideas.map((idea, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-lg text-purple-700 dark:text-purple-300">
                        {idea.title}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {idea.premise}
                      </p>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        {idea.genre}
                      </Badge>
                      <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                        {idea.mood}
                      </Badge>
                    </div>
                    
                    {/* Characters and Themes */}
                    {idea.characters.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Characters:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {idea.characters.join(", ")}
                        </p>
                      </div>
                    )}
                    
                    {idea.themes.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Themes:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {idea.themes.join(", ")}
                        </p>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleUseIdea(idea)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <BookOpen className="w-3 h-3 mr-1" />
                        Start Writing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyIdea(idea)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {ideas.length === 0 && !generateIdeasMutation.isPending && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Describe your story concept above and let AI generate unique ideas for you!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}