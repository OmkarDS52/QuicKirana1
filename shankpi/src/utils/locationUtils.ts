export interface Coordinates {
  lat: number
  lng: number
}

export const AREA_COORDINATES: Record<string, Coordinates> = {
  Rajarampuri: { lat: 16.6908, lng: 74.2408 },
  Shahupuri: { lat: 16.7027, lng: 74.2435 },
  'Tarabai Park': { lat: 16.7093, lng: 74.2464 },
  Laxmipuri: { lat: 16.7005, lng: 74.2263 },
  Gujri: { lat: 16.6944, lng: 74.2215 },
}

// Haversine formula to compute distance in km
export function calculateHaversineDistance(
  coords1: Coordinates,
  coords2: Coordinates
): number {
  const R = 6371 // Earth radius in km
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180
  const dLng = ((coords2.lng - coords1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function findClosestArea(coords: Coordinates): string {
  let closestArea = 'Rajarampuri'
  let minDistance = Infinity

  for (const [area, areaCoords] of Object.entries(AREA_COORDINATES)) {
    const dist = calculateHaversineDistance(coords, areaCoords)
    if (dist < minDistance) {
      minDistance = dist
      closestArea = area
    }
  }

  return closestArea
}

// Generates slightly offset mock coordinates for a shop so they display distinct realistic distances
export function getMockShopCoordinates(shopId: string, areaName: string): Coordinates {
  const base = AREA_COORDINATES[areaName] || AREA_COORDINATES['Rajarampuri']
  
  // Simple deterministic hash function to get a stable offset for a shopId
  let hash = 0
  for (let i = 0; i < shopId.length; i++) {
    hash = shopId.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Create small offsets (-0.003 to 0.003 degrees, approx -300m to +300m)
  const latOffset = ((Math.abs(hash) % 60) / 10000) - 0.003
  const lngOffset = ((Math.abs(hash >> 8) % 60) / 10000) - 0.003
  
  return {
    lat: base.lat + latOffset,
    lng: base.lng + lngOffset,
  }
}
