
import { RadioStation, CountryInfo, CategoryInfo } from "../types/radioTypes";

// Multiple API endpoints for redundancy
export const API_ENDPOINTS = [
  "https://de1.api.radio-browser.info/json",
  "https://fr1.api.radio-browser.info/json",
  "https://nl1.api.radio-browser.info/json"
];

// Fallback data for countries
export const FALLBACK_COUNTRIES: CountryInfo[] = [
  { name: "Congo", code: "CG", stationCount: 10 },
  { name: "Democratic Republic of the Congo", code: "CD", stationCount: 15 },
  { name: "France", code: "FR", stationCount: 500 },
  { name: "United States", code: "US", stationCount: 1000 },
  { name: "United Kingdom", code: "GB", stationCount: 400 },
  { name: "Germany", code: "DE", stationCount: 300 },
  { name: "Canada", code: "CA", stationCount: 200 },
  { name: "Australia", code: "AU", stationCount: 150 },
  { name: "Brazil", code: "BR", stationCount: 180 },
  { name: "Japan", code: "JP", stationCount: 120 }
];

// Fallback data for categories
export const FALLBACK_CATEGORIES: CategoryInfo[] = [
  { name: "News", stationCount: 500 },
  { name: "Music", stationCount: 2000 },
  { name: "Talk", stationCount: 300 },
  { name: "Sports", stationCount: 150 },
  { name: "Culture", stationCount: 100 },
  { name: "Pop", stationCount: 400 },
  { name: "Rock", stationCount: 350 },
  { name: "Jazz", stationCount: 200 },
  { name: "Classical", stationCount: 180 },
  { name: "Hip Hop", stationCount: 250 }
];

// Fallback stations for when API fails
export const FALLBACK_STATIONS: RadioStation[] = [
  {
    id: "fallback-1",
    name: "Radio Congo",
    url: "https://streamingv2.shoutcast.com/radio-congo",
    favicon: "https://placehold.co/100x100/333/888?text=Radio+Congo",
    country: "Congo",
    language: "French",
    tags: ["news", "music"],
    votes: 10,
    clickCount: 50
  },
  {
    id: "fallback-2",
    name: "DRC FM",
    url: "https://streamingv2.shoutcast.com/drc-fm",
    favicon: "https://placehold.co/100x100/333/888?text=DRC+FM",
    country: "Democratic Republic of the Congo",
    language: "French",
    tags: ["news", "talk"],
    votes: 15,
    clickCount: 75
  },
  {
    id: "fallback-3",
    name: "France Info",
    url: "https://direct.franceinfo.fr/live/franceinfo-midfi.mp3",
    favicon: "https://placehold.co/100x100/333/888?text=France+Info",
    country: "France",
    language: "French",
    tags: ["news"],
    votes: 100,
    clickCount: 5000
  },
  {
    id: "fallback-4",
    name: "BBC World Service",
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    favicon: "https://placehold.co/100x100/333/888?text=BBC",
    country: "United Kingdom",
    language: "English",
    tags: ["news"],
    votes: 200,
    clickCount: 10000
  },
  {
    id: "fallback-5",
    name: "CNN Radio",
    url: "https://tunein.com/cnn/",
    favicon: "https://placehold.co/100x100/333/888?text=CNN",
    country: "United States",
    language: "English",
    tags: ["news"],
    votes: 150,
    clickCount: 8000
  }
];
