/**
 * Zemin Kat (Ground Floor) - Mimari Zemin Kat-Model (1).pdf
 * Tam ve eksiksiz kat planı verisi. Hastane giriş katı.
 */

export const ZEMIN_KAT_META = {
  floorName: 'Zemin Kat',
  level: 0,
  buildingCode: 'MS-BL8A',
  planSource: 'Mimari Zemin Kat-Model (1).pdf',
} as const;

/** Oda: kod, ad, fonksiyon tipi, alan (m²), erişilebilir */
export interface FloorPlanRoom {
  code: string;
  name: string;
  functionType: string;
  areaSqm: number;
  isAccessible: boolean;
  /** Grid/plan pozisyonu (isteğe bağlı) */
  gridX?: number;
  gridY?: number;
}

/** Asansör */
export interface FloorPlanElevator {
  code: string;
  name: string;
  isAccessible: boolean;
}

/** Merdiven (yangın merdiveni vb.) */
export interface FloorPlanStair {
  code: string;
  name: string;
}

/** Çıkış */
export interface FloorPlanExit {
  code: string;
  name: string;
  isEmergencyExit: boolean;
}

export const ZEMIN_KAT_ROOMS: FloorPlanRoom[] = [
  { code: 'ZK-001', name: 'Yangın Merdiveni YM-1', functionType: 'YANGIN_MERDIVENI', areaSqm: 21.56, isAccessible: false },
  { code: 'ZK-002', name: 'Yangın Merdiveni Holü YM-1', functionType: 'YAN_MER_HOLU', areaSqm: 3.55, isAccessible: true },
  { code: 'ZK-003', name: 'Pano Odası (Elektrik)', functionType: 'PANO_ODASI', areaSqm: 4.51, isAccessible: false },
  { code: 'ZK-004', name: 'Asansör Holü (Sedye)', functionType: 'ASANSOR_HOLU_SEDYE', areaSqm: 13.06, isAccessible: true },
  { code: 'ZK-005', name: 'Asansör Holü (Yolcu)', functionType: 'ASANSOR_HOLU_YOLCU', areaSqm: 29.42, isAccessible: true },
  { code: 'ZK-006', name: 'Asansör Holü (Sedye) 2', functionType: 'ASANSOR_HOLU_SEDYE', areaSqm: 7.46, isAccessible: true },
  { code: 'ZK-007', name: 'Pano Odası (Elektrik) 2', functionType: 'PANO_ODASI', areaSqm: 4.63, isAccessible: false },
  { code: 'ZK-008', name: 'Yangın Merdiveni YM-2', functionType: 'YANGIN_MERDIVENI', areaSqm: 15.5, isAccessible: false },
  { code: 'ZK-009', name: 'Yangın Merdiveni Holü YM-2', functionType: 'YAN_MER_HOLU', areaSqm: 5.63, isAccessible: true },
  { code: 'ZK-010', name: 'Depo', functionType: 'DEPO', areaSqm: 3.19, isAccessible: false },
  { code: 'ZK-011', name: 'Kat Holü', functionType: 'KAT_HOLU', areaSqm: 96.97, isAccessible: true },
  { code: 'ZK-012', name: 'CPR', functionType: 'CPR', areaSqm: 31.73, isAccessible: true },
  { code: 'ZK-013', name: 'Alçı Odası', functionType: 'ALCI_ODASI', areaSqm: 9.93, isAccessible: true },
  { code: 'ZK-014', name: 'Nöbetçi Doktor Odası', functionType: 'NOBETCI_DOKTOR', areaSqm: 16.25, isAccessible: true },
  { code: 'ZK-015', name: 'Depo 2', functionType: 'DEPO', areaSqm: 3.12, isAccessible: false },
  { code: 'ZK-016', name: 'Ambulans Personel', functionType: 'AMBULANS_PERSONEL', areaSqm: 10.78, isAccessible: true },
  { code: 'ZK-017', name: 'Acil Bekleme', functionType: 'ACIL_BEKLEME', areaSqm: 136.27, isAccessible: true },
  { code: 'ZK-018', name: 'Acil Muayene Odası', functionType: 'ACIL_MUAYENE', areaSqm: 16.5, isAccessible: true },
  { code: 'ZK-019', name: 'Pansuman ve Enjeksiyon Odası', functionType: 'PANSUMAN_ENJEKSIYON', areaSqm: 6.77, isAccessible: true },
  { code: 'ZK-020', name: 'Ateşli Çocuk Banyo', functionType: 'ATESLI_COCUK_BANYO', areaSqm: 5.89, isAccessible: true },
  { code: 'ZK-021', name: 'WC (Engelli)', functionType: 'WC_ENGELLI', areaSqm: 5.74, isAccessible: true },
  { code: 'ZK-022', name: 'WC (Engelli) 2', functionType: 'WC_ENGELLI', areaSqm: 5.27, isAccessible: true },
  { code: 'ZK-023', name: 'Dekontaminasyon', functionType: 'DEKONTAMINASYON', areaSqm: 3.72, isAccessible: true },
  { code: 'ZK-024', name: 'Gözlem Odası 1', functionType: 'GOZLEM_ODASI', areaSqm: 8.48, isAccessible: true },
  { code: 'ZK-025', name: 'Gözlem Odası 2', functionType: 'GOZLEM_ODASI', areaSqm: 8.48, isAccessible: true },
  { code: 'ZK-026', name: 'Gözlem Odası 3', functionType: 'GOZLEM_ODASI', areaSqm: 8.19, isAccessible: true },
  { code: 'ZK-027', name: 'İlaç Hazırlık', functionType: 'ILAC_HAZIRLIK', areaSqm: 8.28, isAccessible: true },
  { code: 'ZK-028', name: 'Gözlem Odası 4', functionType: 'GOZLEM_ODASI', areaSqm: 8.56, isAccessible: true },
  { code: 'ZK-029', name: 'Gözlem Odası 5', functionType: 'GOZLEM_ODASI', areaSqm: 8.09, isAccessible: true },
  { code: 'ZK-030', name: 'Acil Gözlem Alanı', functionType: 'ACIL_GOZLEM_ALANI', areaSqm: 53.64, isAccessible: true },
  { code: 'ZK-031', name: 'Gözlem Odası 6', functionType: 'GOZLEM_ODASI', areaSqm: 8.18, isAccessible: true },
  { code: 'ZK-032', name: 'Gözlem Odası 7', functionType: 'GOZLEM_ODASI', areaSqm: 8.61, isAccessible: true },
  { code: 'ZK-033', name: 'Gözlem Odası 8', functionType: 'GOZLEM_ODASI', areaSqm: 7.95, isAccessible: true },
  { code: 'ZK-034', name: 'Gözlem Odası 9', functionType: 'GOZLEM_ODASI', areaSqm: 8.53, isAccessible: true },
  { code: 'ZK-035', name: 'Gözlem Odası 10', functionType: 'GOZLEM_ODASI', areaSqm: 7.95, isAccessible: true },
  { code: 'ZK-036', name: 'Gözlem Odası 11', functionType: 'GOZLEM_ODASI', areaSqm: 8.23, isAccessible: true },
  { code: 'ZK-037', name: 'İlk Muayene ve Triaj Odası', functionType: 'TRIAJ', areaSqm: 16.25, isAccessible: true },
  { code: 'ZK-038', name: 'Acil Müdahale', functionType: 'ACIL_MUDAHALE', areaSqm: 21.93, isAccessible: true },
  { code: 'ZK-039', name: 'WC (Genel)', functionType: 'WC_GENEL', areaSqm: 11.27, isAccessible: true },
  { code: 'ZK-040', name: 'WC (Genel) 2', functionType: 'WC_GENEL', areaSqm: 7.53, isAccessible: true },
  { code: 'ZK-041', name: 'Doktor Rapor Odası', functionType: 'DOKTOR_RAPOR', areaSqm: 18.65, isAccessible: true },
  { code: 'ZK-042', name: 'Raportör Odası', functionType: 'RAPORTOR', areaSqm: 7.09, isAccessible: true },
  { code: 'ZK-043', name: 'Dijital Röntgen (Engelli)', functionType: 'RONTGEN_ENGELLI', areaSqm: 30.1, isAccessible: true },
  { code: 'ZK-044', name: 'Röntgen', functionType: 'RONTGEN', areaSqm: 27.35, isAccessible: true },
  { code: 'ZK-045', name: 'WC (Engelli) Radyoloji', functionType: 'WC_ENGELLI', areaSqm: 5.22, isAccessible: true },
  { code: 'ZK-047', name: 'MR-CT Kontrol Odası 1', functionType: 'MR_CT_KONTROL', areaSqm: 11.25, isAccessible: true },
  { code: 'ZK-048', name: 'Soyunma Kabini 1', functionType: 'KABINI_SOYUNMA', areaSqm: 1.81, isAccessible: true },
  { code: 'ZK-049', name: 'CT', functionType: 'CT', areaSqm: 39.91, isAccessible: true },
  { code: 'ZK-050', name: 'Yangın Merdiveni (Radyoloji)', functionType: 'YANGIN_MERDIVENI', areaSqm: 16.45, isAccessible: false },
  { code: 'ZK-051', name: 'MR-CT Kontrol Odası 2', functionType: 'MR_CT_KONTROL', areaSqm: 11.56, isAccessible: true },
  { code: 'ZK-052', name: 'Soyunma Kabini 2', functionType: 'KABINI_SOYUNMA', areaSqm: 3.59, isAccessible: true },
  { code: 'ZK-053', name: 'MR', functionType: 'MR', areaSqm: 35.68, isAccessible: true },
  { code: 'ZK-054', name: 'Koridor (Radyoloji)', functionType: 'KORIDOR_RADYOLOJI', areaSqm: 95.47, isAccessible: true },
  { code: 'ZK-055', name: 'USG 1', functionType: 'USG', areaSqm: 7.79, isAccessible: true },
  { code: 'ZK-056', name: 'Depo (Kirli)', functionType: 'DEPO_KIRLI', areaSqm: 3.86, isAccessible: false },
  { code: 'ZK-057', name: 'Depo (Temiz)', functionType: 'DEPO_TEMIZ', areaSqm: 3.86, isAccessible: true },
  { code: 'ZK-058', name: 'USG 2', functionType: 'USG', areaSqm: 9.22, isAccessible: true },
  { code: 'ZK-059', name: 'USG 3', functionType: 'USG', areaSqm: 9.9, isAccessible: true },
  { code: 'ZK-060', name: 'USG 4', functionType: 'USG', areaSqm: 9.11, isAccessible: true },
  { code: 'ZK-061', name: 'Kemik Dansitometre', functionType: 'KEMIK_DANSITOMETRE', areaSqm: 15.82, isAccessible: true },
  { code: 'ZK-062', name: 'Poliklinik Odası (Radyoloji)', functionType: 'POLIKLINIK_RADYOLOJI', areaSqm: 17.72, isAccessible: true },
  { code: 'ZK-063', name: 'Bekleme Alanı (Radyoloji)', functionType: 'BEKLEME_RADYOLOJI', areaSqm: 43.51, isAccessible: true },
  { code: 'ZK-064', name: 'Teknik Odası (MR)', functionType: 'TEKNIK_ODASI_MR', areaSqm: 10.97, isAccessible: false },
  { code: 'ZK-065', name: 'Poliklinik Odası (Ortopedi) 1', functionType: 'POLIKLINIK_ORTOPEDI', areaSqm: 21.97, isAccessible: true },
  { code: 'ZK-066', name: 'Poliklinik Odası (Ortopedi) 2', functionType: 'POLIKLINIK_ORTOPEDI', areaSqm: 16.81, isAccessible: true },
  { code: 'ZK-067', name: 'Poliklinik Odası (Ortopedi) 3', functionType: 'POLIKLINIK_ORTOPEDI', areaSqm: 16.21, isAccessible: true },
  { code: 'ZK-068', name: 'Poliklinik Odası (Ortopedi) 4', functionType: 'POLIKLINIK_ORTOPEDI', areaSqm: 16.76, isAccessible: true },
  { code: 'ZK-069', name: 'Poliklinik Bekleme Alanı (Ortopedi)', functionType: 'BEKLEME_ORTOPEDI', areaSqm: 47.14, isAccessible: true },
  { code: 'ZK-070', name: 'Poliklinik Odası (Ortopedi) 5', functionType: 'POLIKLINIK_ORTOPEDI', areaSqm: 20.33, isAccessible: true },
  { code: 'ZK-071', name: 'Giriş', functionType: 'GIRIS', areaSqm: 792.18, isAccessible: true },
  { code: 'ZK-072', name: 'Kafe-Restoran', functionType: 'KAFE_RESTORAN', areaSqm: 96.1, isAccessible: true },
  { code: 'ZK-073', name: 'Servis', functionType: 'SERVIS', areaSqm: 24.45, isAccessible: true },
  { code: 'ZK-074', name: 'Mutfak', functionType: 'MUTFAK', areaSqm: 55.34, isAccessible: true },
  { code: 'ZK-076', name: 'WC 1', functionType: 'WC', areaSqm: 3.17, isAccessible: true },
  { code: 'ZK-077', name: 'WC 2', functionType: 'WC', areaSqm: 3.07, isAccessible: true },
  { code: 'ZK-078', name: 'Hasta Hakları', functionType: 'HASTA_HAKLARI', areaSqm: 13.97, isAccessible: true },
  { code: 'ZK-079', name: 'Hasta Yatış', functionType: 'HASTA_YATIS', areaSqm: 14.36, isAccessible: true },
  { code: 'ZK-080', name: 'Anlaşmalı Kurumlar', functionType: 'ANLASMALI_KURUMLAR', areaSqm: 13.68, isAccessible: true },
  { code: 'ZK-081', name: 'Hol (Poliklinik)', functionType: 'HOL', areaSqm: 38.89, isAccessible: true },
  { code: 'ZK-082', name: 'Poliklinik Odası 1', functionType: 'POLIKLINIK', areaSqm: 21.03, isAccessible: true },
  { code: 'ZK-083', name: 'Poliklinik Odası 2', functionType: 'POLIKLINIK', areaSqm: 20.62, isAccessible: true },
  { code: 'ZK-084', name: 'Poliklinik Odası 3', functionType: 'POLIKLINIK', areaSqm: 20.62, isAccessible: true },
  { code: 'ZK-085', name: 'Poliklinik Odası 4', functionType: 'POLIKLINIK', areaSqm: 20.5, isAccessible: true },
  { code: 'ZK-086', name: 'VIP Lounge', functionType: 'VIP_LOUNGE', areaSqm: 27.82, isAccessible: true },
  { code: 'ZK-087', name: 'EKG', functionType: 'EKG', areaSqm: 10.15, isAccessible: true },
  { code: 'ZK-088', name: 'EKO', functionType: 'EKO', areaSqm: 9.55, isAccessible: true },
  { code: 'ZK-089', name: 'Kan Alma', functionType: 'KAN_ALMA', areaSqm: 11.86, isAccessible: true },
  { code: 'ZK-090', name: 'Efor', functionType: 'EFOR', areaSqm: 8.77, isAccessible: true },
  { code: 'ZK-091', name: 'WC 3', functionType: 'WC', areaSqm: 3.96, isAccessible: true },
  { code: 'ZK-092', name: 'Hol (Check-up)', functionType: 'HOL', areaSqm: 39.46, isAccessible: true },
  { code: 'ZK-093', name: 'Kat Holü (Ana)', functionType: 'KAT_HOLU', areaSqm: 311.3, isAccessible: true },
  { code: 'ZK-093A', name: 'PCR Kabini', functionType: 'PCR_KABINI', areaSqm: 2.71, isAccessible: true },
  { code: 'ZK-093B', name: 'Check-up Merkezi Bekleme', functionType: 'CHECKUP_BEKLEME', areaSqm: 94.05, isAccessible: true },
  { code: 'ZK-094', name: 'Soyunma Kabini 3', functionType: 'KABINI_SOYUNMA', areaSqm: 1.82, isAccessible: true },
  { code: 'ZK-095', name: 'Soyunma Kabini 4', functionType: 'KABINI_SOYUNMA', areaSqm: 1.85, isAccessible: true },
  { code: 'ZK-089A', name: 'Kafe-Restoran Açık Alan', functionType: 'KAFE_ACIK_ALAN', areaSqm: 160, isAccessible: true },
  { code: 'ZK-GUV', name: 'Güvenlik Kabini', functionType: 'GUVENLIK_KABINI', areaSqm: 8, isAccessible: true },
  { code: 'ZK-VES', name: 'Çiçeklik ve Vestiyer', functionType: 'VESTIYER', areaSqm: 15, isAccessible: true },
];

export const ZEMIN_KAT_ELEVATORS: FloorPlanElevator[] = [
  { code: 'MD01', name: 'Asansör (Ana)', isAccessible: true },
  { code: 'M01', name: 'Asansör M01 (20x17/29)', isAccessible: true },
  { code: 'YM01', name: 'Asansör YM01 (20x17/25)', isAccessible: true },
  { code: 'SEDYE-1', name: 'Sedye Asansörü 1', isAccessible: true },
  { code: 'SEDYE-2', name: 'Sedye Asansörü 2', isAccessible: true },
];

export const ZEMIN_KAT_STAIRS: FloorPlanStair[] = [
  { code: 'YM-1', name: 'Yangın Merdiveni 1' },
  { code: 'YM-2', name: 'Yangın Merdiveni 2' },
  { code: 'YM-RAD', name: 'Yangın Merdiveni (Radyoloji)' },
];

export const ZEMIN_KAT_EXITS: FloorPlanExit[] = [
  { code: 'CIKIS-ANA', name: 'Hastane Girişi (Ana)', isEmergencyExit: false },
  { code: 'CIKIS-ACIL', name: 'Acil Girişi', isEmergencyExit: true },
  { code: 'CIKIS-YAYA', name: 'Yaya Girişi', isEmergencyExit: false },
  { code: 'CIKIS-SEDYE', name: 'Sedye Girişi', isEmergencyExit: false },
  { code: 'CIKIS-VALE', name: 'Vale Noktası', isEmergencyExit: false },
];
