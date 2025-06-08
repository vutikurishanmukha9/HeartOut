import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI secret: OPENAI_API_KEY');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface StoryIdea {
  title: string;
  premise: string;
  genre: string;
  mood: string;
  characters: string[];
  themes: string[];
}

export interface WritingSuggestion {
  type: "improvement" | "continuation" | "alternative";
  suggestion: string;
  explanation: string;
}

export interface GrammarCheck {
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
    position: number;
  }>;
  overall_score: number;
  suggestions: string[];
}

export class AIService {
  // Generate story ideas based on prompts or themes
  async generateStoryIdeas(prompt: string, count: number = 3): Promise<StoryIdea[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a creative writing assistant that generates compelling story ideas. Respond with a JSON array of story ideas with the exact format: {\"ideas\": [{\"title\": \"string\", \"premise\": \"string\", \"genre\": \"string\", \"mood\": \"string\", \"characters\": [\"string\"], \"themes\": [\"string\"]}]}"
          },
          {
            role: "user",
            content: `Generate ${count} unique and engaging story ideas based on this prompt: "${prompt}". Each story should be different in genre, mood, and approach.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"ideas": []}');
      return result.ideas || [];
    } catch (error) {
      console.error('Error generating story ideas:', error);
      throw new Error('Failed to generate story ideas');
    }
  }

  // Provide writing suggestions for improving existing text
  async getWritingSuggestions(text: string, type: "improve" | "continue" | "alternative" = "improve"): Promise<WritingSuggestion[]> {
    try {
      let systemPrompt = "";
      let userPrompt = "";

      switch (type) {
        case "improve":
          systemPrompt = "You are an expert writing coach. Analyze the provided text and suggest specific improvements for clarity, style, pacing, and engagement. Respond with JSON: {\"suggestions\": [{\"type\": \"improvement\", \"suggestion\": \"string\", \"explanation\": \"string\"}]}";
          userPrompt = `Please provide 2-3 specific suggestions to improve this text: "${text}"`;
          break;
        case "continue":
          systemPrompt = "You are a creative writing assistant. Provide suggestions for how to continue this story naturally. Respond with JSON: {\"suggestions\": [{\"type\": \"continuation\", \"suggestion\": \"string\", \"explanation\": \"string\"}]}";
          userPrompt = `Suggest 2-3 ways to continue this story: "${text}"`;
          break;
        case "alternative":
          systemPrompt = "You are a creative writing assistant. Provide alternative approaches or phrasings for the given text. Respond with JSON: {\"suggestions\": [{\"type\": \"alternative\", \"suggestion\": \"string\", \"explanation\": \"string\"}]}";
          userPrompt = `Provide 2-3 alternative approaches for this text: "${text}"`;
          break;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error('Error getting writing suggestions:', error);
      throw new Error('Failed to get writing suggestions');
    }
  }

  // Check grammar and provide corrections
  async checkGrammar(text: string): Promise<GrammarCheck> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional editor. Check the text for grammar, spelling, and style issues. Respond with JSON: {\"corrections\": [{\"original\": \"string\", \"corrected\": \"string\", \"explanation\": \"string\", \"position\": number}], \"overall_score\": number, \"suggestions\": [\"string\"]}"
          },
          {
            role: "user",
            content: `Please check this text for grammar and style issues: "${text}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"corrections": [], "overall_score": 100, "suggestions": []}');
      return {
        corrections: result.corrections || [],
        overall_score: Math.min(100, Math.max(0, result.overall_score || 100)),
        suggestions: result.suggestions || []
      };
    } catch (error) {
      console.error('Error checking grammar:', error);
      throw new Error('Failed to check grammar');
    }
  }

  // Generate character profiles
  async generateCharacter(description: string): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a character development expert. Create a detailed character profile based on the description. Respond with JSON: {\"name\": \"string\", \"age\": number, \"background\": \"string\", \"personality\": \"string\", \"motivation\": \"string\", \"conflicts\": \"string\", \"appearance\": \"string\", \"quirks\": [\"string\"]}"
          },
          {
            role: "user",
            content: `Create a detailed character based on this description: "${description}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating character:', error);
      throw new Error('Failed to generate character');
    }
  }

  // Analyze story mood and suggest improvements
  async analyzeMood(text: string): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a literary analyst. Analyze the mood and tone of the text. Respond with JSON: {\"mood\": \"string\", \"tone\": \"string\", \"emotions\": [\"string\"], \"atmosphere\": \"string\", \"suggestions\": [\"string\"]}"
          },
          {
            role: "user",
            content: `Analyze the mood and tone of this text: "${text}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error analyzing mood:', error);
      throw new Error('Failed to analyze mood');
    }
  }

  // Generate story outline
  async generateOutline(premise: string, chapters: number = 10): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a story structure expert. Create a detailed ${chapters}-chapter outline. Respond with JSON: {\"title\": \"string\", \"chapters\": [{\"number\": number, \"title\": \"string\", \"summary\": \"string\", \"key_events\": [\"string\"]}], \"themes\": [\"string\"], \"character_arcs\": [\"string\"]}`
          },
          {
            role: "user",
            content: `Create a ${chapters}-chapter story outline for this premise: "${premise}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating outline:', error);
      throw new Error('Failed to generate outline');
    }
  }
}

export const aiService = new AIService();