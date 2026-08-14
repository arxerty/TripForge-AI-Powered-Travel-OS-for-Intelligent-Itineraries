// In a real app, this would use a provider like OpenWeatherMap or Tomorrow.io
export type WeatherForecast = {
  date: string;
  condition: "sunny" | "rainy" | "cloudy" | "snow";
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
};

export async function getTripWeatherForecast(
  latitude: number, 
  longitude: number, 
  startDate: string, 
  endDate: string
): Promise<WeatherForecast[]> {
  const apiKey = process.env.WEATHER_API_KEY;
  
  if (!apiKey) {
    console.warn("Weather API Key missing. Returning mock weather data.");
    return generateMockForecast(startDate, endDate);
  }

  // Implementation for real Weather API fetch goes here
  return generateMockForecast(startDate, endDate);
}

function generateMockForecast(start: string, end: string): WeatherForecast[] {
  return [
    {
      date: "Oct 12",
      condition: "sunny",
      temperatureMax: 27,
      temperatureMin: 18,
      precipitationProbability: 10,
    },
    {
      date: "Oct 13",
      condition: "rainy",
      temperatureMax: 22,
      temperatureMin: 16,
      precipitationProbability: 80,
    },
    {
      date: "Oct 14",
      condition: "cloudy",
      temperatureMax: 24,
      temperatureMin: 17,
      precipitationProbability: 30,
    }
  ];
}
