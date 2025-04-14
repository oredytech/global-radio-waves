import React, { useState, useEffect } from "react";
import Header from "@/components/Header";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles);
        } else {
          console.error("Failed to fetch news");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleMenuClick = () => {
    // Menu handling can be implemented here if needed
    console.log("Menu clicked from News page");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 container px-4 py-6 md:px-6">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Latest Entertainment News
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            Loading news...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="bg-gowera-surface rounded-lg shadow-md overflow-hidden">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-400">{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-gowera-highlight hover:underline"
                  >
                    Read More at {article.source.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default News;
