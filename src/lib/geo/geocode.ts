import { findKnownCity } from "./cities";

// Free, key-less geocoding via Open-Meteo (https://open-meteo.com/en/docs/geocoding-api),
// with a built-in list of popular cities when the API can't be reached.
export interface GeoResult {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export type GeocodeOutcome =
  | { ok: true; location: GeoResult }
  | { ok: false; reason: "not_found" | "unavailable" };

export async function geocode(query: string, language = "en"): Promise<GeocodeOutcome> {
  // "Tokyo, Japan" → search by the city part; Open-Meteo matches place names only.
  const name = query.split(",")[0].trim();
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", language);

  let reachable = true;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = (await res.json()) as {
        results?: { name: string; country?: string; latitude: number; longitude: number }[];
      };
      const hit = data.results?.[0];
      if (hit) {
        return { ok: true, location: { name: hit.name, country: hit.country, latitude: hit.latitude, longitude: hit.longitude } };
      }
    } else {
      reachable = false;
    }
  } catch (error) {
    console.warn("[GEOCODE] Open-Meteo unreachable, using built-in city list:", (error as Error).message);
    reachable = false;
  }

  const known = findKnownCity(name, language);
  if (known) return { ok: true, location: known };
  return { ok: false, reason: reachable ? "not_found" : "unavailable" };
}
