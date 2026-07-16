export interface GulfCity {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  coordinates: [number, number];
  /** Türkiye sınırı üzerinde bu şehirden gelen hattın ulaştığı nokta */
  borderTarget: [number, number];
}

// Her Körfez şehri, Türkiye sınırının farklı bir noktasına bağlanır (sağ/sol dağılım)
export const gulfCities: GulfCity[] = [
  // Riyad → güneybatı sınır (Hatay / Suriye sınır kapısı civarı)
  { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', countryAr: 'المملكة العربية السعودية', countryEn: 'Saudi Arabia', coordinates: [46.6753, 24.6877], borderTarget: [36.5, 36.6] },
  // Doha → orta-güney sınır (Habur / Irak sınır kapısı civarı)
  { id: 'doha', nameAr: 'الدوحة', nameEn: 'Doha', countryAr: 'قطر', countryEn: 'Qatar', coordinates: [51.531, 25.2854], borderTarget: [42.37, 37.15] },
  // Dubai → güneydoğu sınır (Gürbulak / İran sınır kapısı civarı)
  { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', countryAr: 'الإمارات', countryEn: 'UAE', coordinates: [55.2708, 25.2048], borderTarget: [44.0, 39.5] },
];

// Sayfa açılışındaki kamera animasyonu: önce Körfez, sonra Türkiye'ye geçiş
export const GULF_VIEW_BOUNDS: [[number, number], [number, number]] = [[44, 21.5], [58, 28]];
// Şehir verisi API'den gelmeden önce veya boşsa kullanılan varsayılan Türkiye kadrajı
export const TURKEY_VIEW_BOUNDS: [[number, number], [number, number]] = [[25.5, 35.5], [45, 42.5]];
