// Daily forecast via Open-Meteo (no API key needed). Forecasts only reach ~16 days
// ahead, so days outside that window simply have no entry.
export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snow" | "storm";

export type WeatherForecast = {
  date: string; // YYYY-MM-DD
  condition: WeatherCondition;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
};

const FORECAST_HORIZON_DAYS = 15;

function conditionFromWmo(code: number): WeatherCondition {
  if (code >= 95) return "storm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 51) return "rainy";
  if (code >= 2) return "cloudy";
  return "sunny";
}

export async function getTripWeatherForecast(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<WeatherForecast[]> {
  const today = new Date();
  const horizon = new Date(today.getTime() + FORECAST_HORIZON_DAYS * 86_400_000).toISOString().slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);
  const from = startDate > todayStr ? startDate : todayStr;
  const to = endDate < horizon ? endDate : horizon;
  if (from > to) return [];

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", from);
  url.searchParams.set("end_date", to);

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000), next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const { daily } = (await res.json()) as {
      daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: (number | null)[];
      };
    };
    return daily.time.map((date, i) => ({
      date,
      condition: conditionFromWmo(daily.weather_code[i]),
      temperatureMax: Math.round(daily.temperature_2m_max[i]),
      temperatureMin: Math.round(daily.temperature_2m_min[i]),
      precipitationProbability: daily.precipitation_probability_max[i] ?? 0,
    }));
  } catch {
    return [];
  }
}
