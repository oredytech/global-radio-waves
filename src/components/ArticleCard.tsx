
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Article } from "@/services/types/radioTypes";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // Use date or pubDate, whichever is available
  const dateString = article.date || article.pubDate;
  const formattedDate = dateString ? formatDistanceToNow(new Date(dateString), { 
    addSuffix: true,
    locale: fr
  }) : "";
  
  // Use excerpt or description, whichever is available
  const description = article.excerpt || article.description || "";
  
  // Use featured_image_url or image, whichever is available
  const imageUrl = article.featured_image_url || article.image;
  
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-zinc-900 border-zinc-800 hover:border-gowera-highlight/50 transition-all duration-300">
      <div className="aspect-[16/9] overflow-hidden bg-zinc-800">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://placehold.co/600x400/222/666?text=Actualité`;
          }}
        />
      </div>
      <CardHeader className="p-4 pb-2 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-gowera-surface text-xs">
            {article.source || "News"}
          </Badge>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
        <CardTitle className="text-lg font-bold line-clamp-2">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 mt-1 text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-1">
        <a 
          href={article.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-gowera-highlight hover:underline"
        >
          Lire l'article complet
        </a>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
