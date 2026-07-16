import type { PropertyCategory } from '@/data/properties';

/** Admin panelindeki serbest kategori string'lerini (BEACHFRONT/VILLA/...) haritanın
 * ve /properties sayfasının kullandığı sabit PropertyCategory değerlerine çevirir. */
const MAP: Record<string, PropertyCategory> = {
  VILLA: 'villas',
  BEACHFRONT: 'villas',
  APARTMENT: 'apartments',
  STUDIO: 'apartments',
  PENTHOUSE: 'apartments',
  COMMERCIAL: 'commercial',
  LAND: 'land',
  HOTEL: 'hotels',
};

export function toFrontendCategory(dbCategory: string): PropertyCategory {
  return MAP[dbCategory?.toUpperCase()] ?? 'apartments';
}
