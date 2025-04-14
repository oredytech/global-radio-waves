
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
