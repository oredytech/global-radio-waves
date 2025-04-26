import { toast } from "sonner";

export interface WordPressArticle {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  featured_image_url: string;
  source: string;
}

const WORDPRESS_SITES = [
  {
    name: "Kivu7",
    url: "https://kivu7.net/wp-json/wp/v2/posts",
    apiUrl: "https://kivu7.net",
  },
  {
    name: "KivuReporter",
    url: "https://kivureporter.net/wp-json/wp/v2/posts",
    apiUrl: "https://kivureporter.net",
  },
  {
    name: "AupicInfo",
    url: "https://aupicinfo.com/wp-json/wp/v2/posts",
    apiUrl: "https://aupicinfo.com",
  },
  {
    name: "TotalementActus",
    url: "https://totalementactus.net/wp-json/wp/v2/posts",
    apiUrl: "https://totalementactus.net",
  },
  {
    name: "RCVMA",
    url: "https://rcvma.net/wp-json/wp/v2/posts",
    apiUrl: "https://rcvma.net",
  },
  {
    name: "RTCM",
    url: "https://rtcm-rdc.com/wp-json/wp/v2/posts",
    apiUrl: "https://rtcm-rdc.com",
  },
];

// Fallback news articles in case API calls fail
const FALLBACK_ARTICLES: WordPressArticle[] = [
  {
    id: 1,
    title: "RDC : La situation sécuritaire à l'Est préoccupe les Nations Unies",
    excerpt: "Les Nations Unies ont exprimé leur préoccupation concernant la dégradation de la situation sécuritaire dans l'Est de la RDC...",
    date: "2025-04-10T10:30:00",
    link: "#",
    featured_image_url: "https://placehold.co/600x400/222/666?text=Actualit%C3%A9s+RDC",
    source: "Kivu7"
  },
  {
    id: 2,
    title: "Kinshasa : De nouveaux projets d'infrastructures annoncés",
    excerpt: "Le gouvernement vient d'annoncer le lancement de plusieurs grands projets d'infrastructures à Kinshasa pour améliorer la mobilité urbaine...",
    date: "2025-04-09T14:15:00",
    link: "#",
    featured_image_url: "https://placehold.co/600x400/222/666?text=Infrastructures+Kinshasa",
    source: "KivuReporter"
  },
  {
    id: 3,
    title: "Élections locales : Les résultats préliminaires attendus cette semaine",
    excerpt: "La CENI devrait publier cette semaine les résultats préliminaires des élections locales qui se sont tenues dans plusieurs provinces...",
    date: "2025-04-08T08:45:00",
    link: "#",
    featured_image_url: "https://placehold.co/600x400/222/666?text=%C3%89lections+RDC",
    source: "AupicInfo"
  },
  {
    id: 4,
    title: "Covid-19 : Une nouvelle campagne de vaccination lancée à Goma",
    excerpt: "Les autorités sanitaires ont lancé une nouvelle campagne de vaccination contre la Covid-19 à Goma pour faire face à la recrudescence des cas...",
    date: "2025-04-07T16:20:00",
    link: "#",
    featured_image_url: "https://placehold.co/600x400/222/666?text=Vaccination+Goma",
    source: "TotalementActus"
  },
  {
    id: 5,
    title: "Économie : Le franc congolais se stabilise face au dollar",
    excerpt: "Après plusieurs semaines de fluctuation, le franc congolais se stabilise face au dollar américain sur les marchés de change...",
    date: "2025-04-06T11:10:00",
    link: "#",
    featured_image_url: "https://placehold.co/600x400/222/666?text=%C3%89conomie+RDC",
    source: "RCVMA"
  },
  {
    id: 6,
    title: "Sport : Les Léopards se préparent pour les éliminatoires de la CAN",
    excerpt: "L'équipe nationale de football de la RDC intensifie sa préparation en vue des prochains matchs des éliminatoires de la Coupe d'Afrique des Nations...",
    date: "2025-04-05T09:30:00",
    link: "#",
    featured_image_url: "https://placehold.co/600x400/222/666?text=L%C3%A9opards+Football",
    source: "RTCM"
  },
  {
    id: 7,
    title: "Culture : Festival Amani confirmé pour septembre à Goma",
    excerpt: "Les organisateurs du Festival Amani ont confirmé que l'édition 2025 se tiendra en septembre à Goma avec une programmation exceptionnelle...",
    date: "2025-04-04T13:25:00",
    link: "#",
    featured_image_url: "https://placehold.co/600x400/222/666?text=Festival+Amani",
    source: "Kivu7"
  },
  {
    id: 8,
    title: "Environnement : Nouveau projet de protection du Parc des Virunga",
    excerpt: "Un nouveau projet de protection du Parc National des Virunga a été lancé avec le soutien de plusieurs organisations internationales...",
    date: "2025-04-03T15:40:00",
    link: "#",
    featured_image_url: "https://placehold.co/600x400/222/666?text=Parc+Virunga",
    source: "KivuReporter"
  }
];

async function fetchArticlesFromSite(site: typeof WORDPRESS_SITES[0], perPage: number = 8): Promise<WordPressArticle[]> {
  try {
    const response = await fetch(`${site.url}?_embed=wp:featuredmedia&per_page=${perPage}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${site.name}: ${response.statusText}`);
    }
    
    const articles = await response.json();
    
    return articles.map((article: any) => {
      // Extract featured image URL if available
      let featuredImageUrl = "https://placehold.co/600x400/222/666?text=No+Image";
      if (article._embedded && 
          article._embedded['wp:featuredmedia'] && 
          article._embedded['wp:featuredmedia'][0] &&
          article._embedded['wp:featuredmedia'][0].source_url) {
        featuredImageUrl = article._embedded['wp:featuredmedia'][0].source_url;
      }
      
      // Clean excerpt from HTML tags
      const excerpt = article.excerpt.rendered
        ? article.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150) + "..."
        : "No description available";
      
      return {
        id: article.id,
        title: article.title.rendered || "No title",
        excerpt: excerpt,
        date: article.date || new Date().toISOString(),
        link: article.link || "#",
        featured_image_url: featuredImageUrl,
        source: site.name
      };
    });
  } catch (error) {
    console.error(`Error fetching articles from ${site.name}:`, error);
    return [];
  }
}

export async function fetchAllArticles(articlesPerSite: number = 8): Promise<WordPressArticle[]> {
  try {
    // Try to fetch from all sites simultaneously
    const allPromises = WORDPRESS_SITES.map(site => fetchArticlesFromSite(site, articlesPerSite));
    const results = await Promise.all(allPromises);
    
    // Flatten and mix results
    let allArticles: WordPressArticle[] = results.flat();
    
    // Sort by date (newest first)
    allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (allArticles.length === 0) {
      console.warn("No articles fetched from any source, using fallback data");
      return FALLBACK_ARTICLES;
    }
    
    return allArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    toast.error("Impossible de charger les actualités, affichage des données de secours.");
    return FALLBACK_ARTICLES;
  }
}
