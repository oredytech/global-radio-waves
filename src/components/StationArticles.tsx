
import React from "react";
import { Card } from "@/components/ui/card";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/services/types/radioTypes";

interface StationArticlesProps {
  articles: Article[];
}

const StationArticles: React.FC<StationArticlesProps> = ({ articles }) => (
  <div className="mb-20">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Actualités récentes</h2>
      <div className="flex items-center text-sm text-gray-400">
        <span>Dernières actualités</span>
      </div>
    </div>
    {articles.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    ) : (
      <Card className="p-6 text-center bg-gowera-surface border-none">
        <p>Pas d'actualités récentes disponibles</p>
      </Card>
    )}
  </div>
);

export default StationArticles;
