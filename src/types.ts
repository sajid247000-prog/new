export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
}

export type Category = 'General' | 'Technology' | 'Business' | 'Science' | 'Health' | 'Entertainment' | 'Sports';
