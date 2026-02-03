/**
 * Zemin Kat bölge (zone) tanımları – Neo4j topolojisi için.
 * Her bölgenin bir hub odası (koridor/hol) vardır; odalar önce hub'a, hub'lar ana hole bağlanır.
 */

/** Oda numarasına göre zone hub room number döner (örn. ZK-024 -> ZK-011). */
export function getZoneHubForRoomNumber(roomNumber: string | null): string | null {
  if (!roomNumber) return null;
  const u = roomNumber.toUpperCase();
  const num = parseRoomNum(u);
  if (num === null) {
    if (u === 'ZK-GUV' || u === 'ZK-VES') return 'ZK-093';
    if (u === 'ZK-089A') return 'ZK-071';
    return 'ZK-093';
  }
  if (num >= 10 && num <= 30) return 'ZK-011';   // Acil + Kat Holü
  if (num >= 37 && num <= 38) return 'ZK-011';   // Triaj, Acil Müdahale
  if (num >= 39 && num <= 54) return 'ZK-054';   // Radyoloji
  if (num >= 55 && num <= 70) return 'ZK-069';   // Ortopedi
  if (num >= 71 && num <= 77) return 'ZK-071';   // Giriş, Kafe, WC
  if (num >= 78 && num <= 92) return 'ZK-081';   // Poliklinik
  if (num >= 93 && num <= 95) return 'ZK-093';   // Ana hol, Check-up
  return 'ZK-093';
}

function parseRoomNum(s: string): number | null {
  const m = s.match(/ZK-0*(\d+)/);
  if (!m) return null;
  return parseInt(m[1], 10);
}

/** Zemin Kat zone hub oda numaraları (ana hub ilk). */
export const ZEMIN_KAT_ZONE_HUBS = ['ZK-093', 'ZK-011', 'ZK-054', 'ZK-069', 'ZK-071', 'ZK-081'] as const;

/** Birbirine komşu zone'lar (hub'lar arası bağlantı). */
export const ZONE_HUB_EDGES: [string, string][] = [
  ['ZK-093', 'ZK-011'],
  ['ZK-093', 'ZK-071'],
  ['ZK-093', 'ZK-081'],
  ['ZK-011', 'ZK-054'],
  ['ZK-054', 'ZK-069'],
  ['ZK-071', 'ZK-081'],
];
