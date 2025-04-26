
export interface RadioStation {
  id: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  language: string;
  tags: string[];
  votes: number;
  clickCount: number;
}

export interface CountryInfo {
  name: string;
  code: string;
  stationCount: number;
}

export interface CategoryInfo {
  name: string;
  stationCount: number;
}

// Updated Article interface to be compatible with WordPressArticle
export interface Article {
  id?: number | string;
  title: string;
  excerpt?: string; // Added from WordPressArticle
  description?: string; // Made optional
  link: string;
  date?: string; // Added from WordPressArticle
  pubDate?: string; // Made optional
  featured_image_url?: string; // Added from WordPressArticle
  source?: string; // Added from WordPressArticle
  content?: string;
  image?: string;
}
