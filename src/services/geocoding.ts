/**
 * VayuShield AI - Geocoding Service
 * OpenStreetMap Nominatim lookup + preset global smog hotspots.
 */

export interface CityLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  region: string;
}

export const PRESET_CITIES: CityLocation[] = [
  { name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, region: 'NCR / Northern Plains' },
  { name: 'Noida', country: 'India', latitude: 28.5355, longitude: 77.3910, region: 'NCR / Uttar Pradesh' },
  { name: 'Gurugram', country: 'India', latitude: 28.4595, longitude: 77.0266, region: 'NCR / Haryana' },
  { name: 'Lahore', country: 'Pakistan', latitude: 31.5497, longitude: 74.3436, region: 'Punjab Smog Basin' },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, region: 'Maharashtra Coastal' },
  { name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639, region: 'West Bengal' },
  { name: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462, region: 'Indo-Gangetic Basin' },
  { name: 'Beijing', country: 'China', latitude: 39.9042, longitude: 116.4074, region: 'Northern China' },
  { name: 'Salt Lake City', country: 'USA', latitude: 40.7608, longitude: -111.8910, region: 'Utah Inversion Basin' },
  { name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278, region: 'Greater London' },
];

export async function searchCities(query: string): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  // Check preset cities first
  const matchingPresets = PRESET_CITIES.filter((c) =>
    c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
    c.country.toLowerCase().includes(trimmed.toLowerCase())
  );

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      trimmed
    )}&format=json&addressdetails=1&limit=5`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });

    if (!res.ok) return matchingPresets;

    const results = await res.json();
    const geocoded: CityLocation[] = results.map((item: any) => ({
      name: item.name || item.display_name.split(',')[0],
      country: item.address?.country || '',
      region: item.address?.state || item.address?.county || '',
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));

    // Merge without duplicates
    const combined = [...matchingPresets];
    for (const g of geocoded) {
      if (!combined.some((c) => Math.abs(c.latitude - g.latitude) < 0.1 && Math.abs(c.longitude - g.longitude) < 0.1)) {
        combined.push(g);
      }
    }

    return combined.slice(0, 8);
  } catch (error) {
    console.warn('Nominatim geocode failed, returning presets', error);
    return matchingPresets;
  }
}
