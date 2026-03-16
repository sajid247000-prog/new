/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  X, 
  Newspaper, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  RefreshCw,
  Globe,
  Cpu,
  Briefcase,
  FlaskConical,
  HeartPulse,
  Film,
  Trophy
} from 'lucide-react';
import { fetchNews } from './services/newsService';
import { NewsArticle, Category } from './types';

const CATEGORIES: { name: Category; icon: React.ReactNode }[] = [
  { name: 'General', icon: <Globe className="w-4 h-4" /> },
  { name: 'Technology', icon: <Cpu className="w-4 h-4" /> },
  { name: 'Business', icon: <Briefcase className="w-4 h-4" /> },
  { name: 'Science', icon: <FlaskConical className="w-4 h-4" /> },
  { name: 'Health', icon: <HeartPulse className="w-4 h-4" /> },
  { name: 'Entertainment', icon: <Film className="w-4 h-4" /> },
  { name: 'Sports', icon: <Trophy className="w-4 h-4" /> },
];

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadNews = async (category: Category) => {
    setLoading(true);
    setError(null);
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("API Key missing. Please ensure GEMINI_API_KEY is available.");
      }
      const data = await fetchNews(category);
      setArticles(data);
    } catch (err: any) {
      console.error("Failed to fetch news:", err);
      setError(err.message || "An unexpected error occurred while loading news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(selectedCategory);
  }, [selectedCategory]);

  const [error, setError] = useState<string | null>(null);

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-black/5 rounded-full md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">SmartNews AI</h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
          <input 
            type="text" 
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/5 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => loadNews(selectedCategory)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
            JD
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 p-6 border-r border-black/5 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 mb-4 px-3">Categories</p>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  selectedCategory === cat.name 
                    ? 'bg-emerald-50 text-emerald-700 font-medium' 
                    : 'hover:bg-black/5 text-black/60'
                }`}
              >
                {cat.icon}
                <span className="text-sm">{cat.name}</span>
              </button>
            ))}
          </nav>

          <div className="mt-12 p-4 bg-emerald-900 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-medium text-emerald-300 mb-1">AI Powered</p>
              <p className="text-sm font-bold leading-tight">Summarize any news with Gemini AI</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <Cpu className="w-20 h-20" />
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-50 md:hidden"
              />
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 p-6 md:hidden shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-6 h-6 text-emerald-600" />
                    <h1 className="text-xl font-bold">SmartNews</h1>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-black/5 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        selectedCategory === cat.name 
                          ? 'bg-emerald-50 text-emerald-700 font-medium' 
                          : 'hover:bg-black/5 text-black/60'
                      }`}
                    >
                      {cat.icon}
                      <span className="text-sm">{cat.name}</span>
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-1">{selectedCategory} News</h2>
              <p className="text-black/40 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending stories curated for you
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-black/5 animate-pulse">
                  <div className="aspect-video bg-black/5 rounded-xl mb-4" />
                  <div className="h-4 bg-black/5 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-black/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-700 text-sm mb-6">{error}</p>
              <button 
                onClick={() => loadNews(selectedCategory)}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] text-black/40 font-medium uppercase tracking-wider mb-3">
                      <Clock className="w-3 h-3" />
                      {article.publishedAt}
                    </div>
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-emerald-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-black/60 line-clamp-2 mb-4">
                      {article.summary}
                    </p>
                    <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
                      <span className="text-xs font-medium text-black/40">By {article.author}</span>
                      <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-black/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-black/20" />
              </div>
              <h3 className="text-xl font-bold mb-2">No news found</h3>
              <p className="text-black/40">Try searching for something else or change category.</p>
            </div>
          )}
        </main>
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:w-full md:max-w-3xl md:max-h-[85vh] bg-white z-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="relative h-64 md:h-80 shrink-0">
                <img 
                  src={selectedArticle.imageUrl} 
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <span className="bg-emerald-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">{selectedArticle.title}</h2>
                </div>
              </div>
              <div className="p-6 md:p-10 overflow-y-auto">
                <div className="flex items-center gap-4 mb-8 text-sm text-black/40">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center font-bold text-xs text-black/60">
                      {selectedArticle.author[0]}
                    </div>
                    <span>{selectedArticle.author}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-black/10" />
                  <span>{selectedArticle.publishedAt}</span>
                </div>
                <div className="prose prose-emerald max-w-none">
                  <p className="text-lg font-medium text-black/80 mb-6 leading-relaxed italic border-l-4 border-emerald-500 pl-4">
                    {selectedArticle.summary}
                  </p>
                  <div className="space-y-4 text-black/70 leading-relaxed">
                    {selectedArticle.content.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-black/5 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80 transition-colors"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
