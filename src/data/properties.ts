export type PropertyCategory = 'villas' | 'land' | 'apartments' | 'commercial' | 'hotels';

export interface Property {
  id: string;
  city: string;
  cityEn: string;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  price: string;
  area: number;
  rooms: string;
  typeAr: string;
  typeEn: string;
  category: PropertyCategory;
  badge?: string;
  description?: string;
  descriptionEn?: string;
  features?: string[];
  featuresEn?: string[];
  thumbGradient: string;
  photos: string[];
}
