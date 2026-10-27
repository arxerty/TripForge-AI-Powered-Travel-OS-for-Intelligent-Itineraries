import type { GeneratedTrip } from "@/lib/validation/trip.schema";
import { addDays, tripLengthDays, type TripInput } from "@/lib/trips/types";

// Offline itinerary generator used when no AI key is configured. It produces a
// believable day-by-day plan around the destination's real coordinates so the
// whole product (map, budget, travel mode) can be exercised without an LLM.

type Category = GeneratedTrip["days"][number]["activities"][number]["category"];
type Slot = "morning" | "lunch" | "afternoon" | "evening";

interface Template {
  slot: Slot;
  category: Category;
  minutes: number;
  /** Base cost in EUR at mid-range budget. */
  cost: number;
  tags: string[];
  /** 0 = relaxed, 100 = adventurous */
  energy: number;
  en: [string, string];
  ru: [string, string];
}

const T: Template[] = [
  { slot: "morning", category: "Attraction", minutes: 120, cost: 0, tags: ["History", "Architecture"], energy: 40,
    en: ["Old town walking tour", "Wander the historic core and its main squares before the crowds arrive."],
    ru: ["Прогулка по старому городу", "Исторический центр и главные площади, пока нет толп туристов."] },
  { slot: "morning", category: "Attraction", minutes: 150, cost: 18, tags: ["Art", "History"], energy: 20,
    en: ["Main city museum", "The essential collection — book a timed ticket to skip the queue."],
    ru: ["Главный городской музей", "Основная коллекция. Купите билет на время, чтобы не стоять в очереди."] },
  { slot: "morning", category: "Nature", minutes: 180, cost: 0, tags: ["Nature", "Photography", "Sports"], energy: 85,
    en: ["Sunrise viewpoint hike", "Short but steep trail to the best panorama over the city."],
    ru: ["Поход на смотровую на рассвете", "Короткая, но крутая тропа к лучшей панораме города."] },
  { slot: "morning", category: "Food", minutes: 90, cost: 12, tags: ["Food"], energy: 30,
    en: ["Local market breakfast", "Graze through the stalls of the busiest food market."],
    ru: ["Завтрак на местном рынке", "Пройдитесь по прилавкам самого оживлённого рынка."] },
  { slot: "morning", category: "Nature", minutes: 90, cost: 0, tags: ["Nature"], energy: 10,
    en: ["Stroll in the central park", "Slow start among gardens, ponds and locals jogging."],
    ru: ["Прогулка по центральному парку", "Неспешное утро среди садов и прудов."] },
  { slot: "morning", category: "Attraction", minutes: 120, cost: 15, tags: ["Architecture", "Photography"], energy: 35,
    en: ["Iconic landmark visit", "The postcard sight — go early for the best light."],
    ru: ["Главная достопримечательность", "Самое открыточное место — приходите пораньше ради света."] },

  { slot: "lunch", category: "Food", minutes: 75, cost: 22, tags: ["Food"], energy: 20,
    en: ["Lunch at a local favourite", "Family-run spot serving the regional classics."],
    ru: ["Обед в любимом месте местных", "Семейное заведение с региональной классикой."] },
  { slot: "lunch", category: "Food", minutes: 90, cost: 14, tags: ["Food", "Nightlife"], energy: 50,
    en: ["Street food crawl", "Hop between three or four stalls and share small plates."],
    ru: ["Тур по уличной еде", "Три-четыре точки и маленькие порции на пробу."] },
  { slot: "lunch", category: "Food", minutes: 60, cost: 16, tags: ["Food", "Art"], energy: 15,
    en: ["Café lunch in the arts quarter", "Light lunch surrounded by galleries and studios."],
    ru: ["Обед в кафе арт-квартала", "Лёгкий обед среди галерей и мастерских."] },

  { slot: "afternoon", category: "Attraction", minutes: 120, cost: 14, tags: ["Art"], energy: 20,
    en: ["Contemporary art gallery", "Rotating exhibitions from local and international artists."],
    ru: ["Галерея современного искусства", "Сменные выставки местных и зарубежных художников."] },
  { slot: "afternoon", category: "Shopping", minutes: 120, cost: 0, tags: ["Shopping"], energy: 30,
    en: ["Shopping district", "Design stores, vintage shops and local brands."],
    ru: ["Торговый квартал", "Дизайнерские магазины, винтаж и местные бренды."] },
  { slot: "afternoon", category: "Attraction", minutes: 90, cost: 0, tags: ["Architecture", "History"], energy: 40,
    en: ["Architecture highlights", "Self-guided loop past the most striking buildings."],
    ru: ["Архитектурные шедевры", "Самостоятельный маршрут мимо самых ярких зданий."] },
  { slot: "afternoon", category: "Nature", minutes: 120, cost: 8, tags: ["Nature", "Photography"], energy: 25,
    en: ["Botanical garden", "Greenhouses and quiet paths — perfect for a slower afternoon."],
    ru: ["Ботанический сад", "Оранжереи и тихие аллеи — для неспешного дня."] },
  { slot: "afternoon", category: "Other", minutes: 150, cost: 25, tags: ["Sports", "Nature"], energy: 90,
    en: ["Guided bike tour", "Cover the waterfront and outer neighbourhoods on two wheels."],
    ru: ["Велотур с гидом", "Набережная и дальние районы на велосипеде."] },
  { slot: "afternoon", category: "Attraction", minutes: 120, cost: 0, tags: ["Photography", "Architecture"], energy: 50,
    en: ["Photo walk through hidden streets", "Murals, courtyards and backstreets most visitors miss."],
    ru: ["Фотопрогулка по тайным улочкам", "Муралы, дворики и переулки, которые обычно пропускают."] },
  { slot: "afternoon", category: "Nature", minutes: 180, cost: 10, tags: ["Beaches", "Nature"], energy: 15,
    en: ["Beach afternoon", "Swim, sunbathe and grab a snack at a beach bar."],
    ru: ["Пляжный день", "Купание, солнце и перекус в пляжном баре."] },
  { slot: "afternoon", category: "Attraction", minutes: 150, cost: 16, tags: ["Technology"], energy: 30,
    en: ["Science & technology museum", "Hands-on exhibits — great on a rainy day."],
    ru: ["Музей науки и технологий", "Интерактивные экспозиции — отлично в дождь."] },
  { slot: "afternoon", category: "Shopping", minutes: 120, cost: 0, tags: ["Anime", "Technology", "Shopping"], energy: 45,
    en: ["Pop-culture district", "Arcades, collectibles and themed cafés."],
    ru: ["Квартал поп-культуры", "Игровые автоматы, коллекционные вещи и тематические кафе."] },

  { slot: "evening", category: "Food", minutes: 120, cost: 45, tags: ["Food"], energy: 15,
    en: ["Dinner with a view", "Regional tasting menu overlooking the skyline."],
    ru: ["Ужин с видом", "Дегустационное меню с видом на город."] },
  { slot: "evening", category: "Nightlife", minutes: 120, cost: 30, tags: ["Nightlife"], energy: 60,
    en: ["Rooftop bar", "Cocktails at golden hour, then the city lights."],
    ru: ["Бар на крыше", "Коктейли на закате, а потом огни города."] },
  { slot: "evening", category: "Food", minutes: 120, cost: 20, tags: ["Food", "Shopping"], energy: 40,
    en: ["Night market", "Late-night snacks and handmade souvenirs."],
    ru: ["Ночной рынок", "Поздние перекусы и сувениры ручной работы."] },
  { slot: "evening", category: "Nightlife", minutes: 150, cost: 25, tags: ["Nightlife", "Art"], energy: 70,
    en: ["Live music venue", "Catch a local band in an intimate club."],
    ru: ["Живая музыка", "Местная группа в небольшом клубе."] },
  { slot: "evening", category: "Nature", minutes: 75, cost: 0, tags: ["Nature", "Photography"], energy: 20,
    en: ["Sunset walk along the water", "Easy stroll to end the day with the best sunset spot."],
    ru: ["Прогулка у воды на закате", "Лёгкая прогулка к лучшему месту для заката."] },
];

const INTERESTS_RU: Record<string, string> = {
  Food: "еду", Nature: "природу", Architecture: "архитектуру", History: "историю", Art: "искусство",
  Nightlife: "ночную жизнь", Shopping: "шопинг", Photography: "фото", Anime: "аниме",
  Technology: "технологии", Beaches: "пляжи", Sports: "спорт",
};

const SLOT_TIMES: Record<Slot, string> = { morning: "09:00", lunch: "12:30", afternoon: "14:30", evening: "19:00" };

/** Small deterministic PRNG so the same trip always gets the same layout. */
function seeded(seedText: string) {
  let h = 2166136261;
  for (const ch of seedText) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function generateDemoTrip(
  input: TripInput,
  location: { name: string; latitude: number; longitude: number }
): GeneratedTrip {
  const lang = input.language === "ru" ? "ru" : "en";
  const rand = seeded(`${input.destination}|${input.startDate}`);
  const { relaxedToAdventure, budgetToLuxury, natureToCity } = input.travelStyle;
  const costFactor = 0.6 + budgetToLuxury / 100; // 0.6× … 1.6×
  const nDays = tripLengthDays(input.startDate, input.endDate);
  const used = new Map<Template, number>();

  const score = (t: Template) => {
    let s = rand() * 0.5;
    s += t.tags.filter((tag) => input.interests.includes(tag)).length * 2;
    s -= Math.abs(t.energy - relaxedToAdventure) / 50;
    if (t.category === "Nature") s += (50 - natureToCity) / 50;
    s -= (used.get(t) ?? 0) * 3;
    return s;
  };
  const pick = (slot: Slot) => {
    const best = T.filter((t) => t.slot === slot).sort((a, b) => score(b) - score(a))[0];
    used.set(best, (used.get(best) ?? 0) + 1);
    return best;
  };

  const days = Array.from({ length: nDays }, (_, d) => {
    const slots: Slot[] = ["morning", "lunch", "afternoon", "evening"];
    if (relaxedToAdventure > 65) slots.splice(3, 0, "afternoon");

    let lat = location.latitude + (rand() - 0.5) * 0.02;
    let lng = location.longitude + (rand() - 0.5) * 0.02;
    let walking = 0;
    let secondAfternoon = false;

    const activities = slots.map((slot) => {
      const t = pick(slot);
      const step = 0.004 + rand() * 0.008;
      const angle = rand() * Math.PI * 2;
      lat += Math.cos(angle) * step;
      lng += Math.sin(angle) * step;
      const distanceKm = Math.round(step * 111 * 10) / 10;
      walking += distanceKm;

      let start = SLOT_TIMES[slot];
      if (slot === "afternoon" && secondAfternoon) start = "17:00";
      if (slot === "afternoon") secondAfternoon = true;

      return {
        name: t[lang][0],
        category: t.category,
        description: t[lang][1],
        durationMinutes: t.minutes,
        estimatedCost: Math.round(t.cost * costFactor),
        latitude: Math.round(lat * 1e5) / 1e5,
        longitude: Math.round(lng * 1e5) / 1e5,
        recommendedStartTime: start,
        distanceKm,
      };
    });

    return {
      date: addDays(input.startDate, d),
      city: location.name,
      activities,
      estimatedDailyCost: activities.reduce((sum, a) => sum + a.estimatedCost, 0),
      walkingDistanceKm: Math.round(walking * 10) / 10,
      transportTimeMinutes: Math.round(20 + rand() * 40),
    };
  });

  const sumBy = (cats: Category[]) =>
    days.reduce((s, d) => s + d.activities.filter((a) => cats.includes(a.category)).reduce((x, a) => x + a.estimatedCost, 0), 0);

  const nights = Math.max(1, nDays - 1);
  const breakdown = {
    flights: Math.round(input.budgetAmount * 0.22),
    hotels: Math.round(nights * (55 + budgetToLuxury * 2.2)),
    transport: nDays * 12,
    food: sumBy(["Food"]) + nDays * 15,
    activities: sumBy(["Attraction", "Nature", "Nightlife", "Other"]),
    shopping: input.interests.includes("Shopping") ? nDays * 30 : nDays * 8,
    other: 0,
  };
  const subtotal = Object.values(breakdown).reduce((a, b) => a + b, 0);
  breakdown.other = Math.round(subtotal * 0.05);

  const interestList = input.interests
    .map((i) => (lang === "ru" ? INTERESTS_RU[i] ?? i : i))
    .join(", ")
    .toLowerCase();
  const title =
    lang === "ru"
      ? `${nDays} ${pluralRu(nDays, "день", "дня", "дней")} в ${location.name}`
      : `${nDays} ${nDays === 1 ? "Day" : "Days"} in ${location.name}`;
  const summary =
    lang === "ru"
      ? `Демо-маршрут: ${location.name}, акцент на ${interestList || "сбалансированный набор впечатлений"}. Подключите AI-ключ, чтобы получать маршруты с реальными местами.`
      : `Demo itinerary for ${location.name} built around ${interestList || "a balanced mix of experiences"}. Add an AI key to get plans with real, named places.`;

  return {
    tripTitle: title,
    summary,
    cities: [location.name],
    days,
    estimatedBudget: { totalEstimated: subtotal + breakdown.other, breakdown },
  };
}

function pluralRu(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
