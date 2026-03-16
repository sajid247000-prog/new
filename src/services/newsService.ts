import { GoogleGenAI, Type } from "@google/genai";
import { NewsArticle, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const fetchNews = async (category: Category = 'General'): Promise<NewsArticle[]> => {
  const prompt = `Generate 6 realistic news articles for the category: ${category}. 
  Each article should have a title, a short summary (1 sentence), a full content (2-3 paragraphs), an author name, and a published date (recent).
  Return the result as a JSON array of objects.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING },
            author: { type: Type.STRING },
            publishedAt: { type: Type.STRING },
          },
          required: ["id", "title", "summary", "content", "category", "author", "publishedAt"],
        },
      },
    },
  });

  const articles = JSON.parse(response.text || "[]") as any[];
  
  return articles.map((article, index) => ({
    ...article,
    imageUrl: `https://picsum.photos/seed/${article.id || index}/800/450`,
  }));
};
