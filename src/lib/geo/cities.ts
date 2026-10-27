// Offline fallback for popular destinations, used when the geocoding API is unreachable.
// [English name, Russian name, country, latitude, longitude]
const CITIES: [string, string, string, number, number][] = [
  ["Tokyo", "Токио", "Japan", 35.6762, 139.6503],
  ["Kyoto", "Киото", "Japan", 35.0116, 135.7681],
  ["Osaka", "Осака", "Japan", 34.6937, 135.5023],
  ["Seoul", "Сеул", "South Korea", 37.5665, 126.978],
  ["Bangkok", "Бангкок", "Thailand", 13.7563, 100.5018],
  ["Bali", "Бали", "Indonesia", -8.6705, 115.2126],
  ["Singapore", "Сингапур", "Singapore", 1.3521, 103.8198],
  ["Dubai", "Дубай", "UAE", 25.2048, 55.2708],
  ["Istanbul", "Стамбул", "Turkey", 41.0082, 28.9784],
  ["Tbilisi", "Тбилиси", "Georgia", 41.7151, 44.8271],
  ["Yerevan", "Ереван", "Armenia", 40.1872, 44.5152],
  ["Moscow", "Москва", "Russia", 55.7558, 37.6173],
  ["Saint Petersburg", "Санкт-Петербург", "Russia", 59.9311, 30.3609],
  ["Paris", "Париж", "France", 48.8566, 2.3522],
  ["London", "Лондон", "United Kingdom", 51.5074, -0.1278],
  ["Rome", "Рим", "Italy", 41.9028, 12.4964],
  ["Milan", "Милан", "Italy", 45.4642, 9.19],
  ["Florence", "Флоренция", "Italy", 43.7696, 11.2558],
  ["Venice", "Венеция", "Italy", 45.4408, 12.3155],
  ["Amalfi", "Амальфи", "Italy", 40.634, 14.6027],
  ["Barcelona", "Барселона", "Spain", 41.3874, 2.1686],
  ["Madrid", "Мадрид", "Spain", 40.4168, -3.7038],
  ["Lisbon", "Лиссабон", "Portugal", 38.7223, -9.1393],
  ["Porto", "Порту", "Portugal", 41.1579, -8.6291],
  ["Berlin", "Берлин", "Germany", 52.52, 13.405],
  ["Prague", "Прага", "Czechia", 50.0755, 14.4378],
  ["Vienna", "Вена", "Austria", 48.2082, 16.3738],
  ["Amsterdam", "Амстердам", "Netherlands", 52.3676, 4.9041],
  ["Budapest", "Будапешт", "Hungary", 47.4979, 19.0402],
  ["Athens", "Афины", "Greece", 37.9838, 23.7275],
  ["New York", "Нью-Йорк", "USA", 40.7128, -74.006],
  ["Los Angeles", "Лос-Анджелес", "USA", 34.0522, -118.2437],
  ["Banff", "Банф", "Canada", 51.1784, -115.5708],
  ["Mexico City", "Мехико", "Mexico", 19.4326, -99.1332],
  ["Rio de Janeiro", "Рио-де-Жанейро", "Brazil", -22.9068, -43.1729],
  ["Cape Town", "Кейптаун", "South Africa", -33.9249, 18.4241],
  ["Marrakesh", "Марракеш", "Morocco", 31.6295, -7.9811],
  ["Sydney", "Сидней", "Australia", -33.8688, 151.2093],
];

export function findKnownCity(name: string, language = "en") {
  const q = name.trim().toLowerCase();
  const hit = CITIES.find(([en, ru]) => en.toLowerCase() === q || ru.toLowerCase() === q);
  if (!hit) return null;
  const [en, ru, country, latitude, longitude] = hit;
  return { name: language === "ru" ? ru : en, country, latitude, longitude };
}
