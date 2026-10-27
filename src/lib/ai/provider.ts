import { generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogle } from "@ai-sdk/google";
import { GeneratedTripSchema, type GeneratedTrip } from "@/lib/validation/trip.schema";
import { addDays, tripLengthDays, type TripInput } from "@/lib/trips/types";

export type AIProviderName = "openai" | "gemini";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", ru: "Russian", es: "Spanish", fr: "French", de: "German",
  it: "Italian", ja: "Japanese", zh: "Chinese", ko: "Korean", pt: "Portuguese",
};

/** Which provider is configured, or null when no API key is present (demo mode). */
export function configuredProvider(): AIProviderName | null {
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

function resolveModel(providerName: AIProviderName) {
  if (providerName === "gemini") {
    const google = createGoogle({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY });
    return google(process.env.AI_MODEL || "gemini-2.5-flash");
  }
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai(process.env.AI_MODEL || "gpt-4.1-mini");
}

export async function generateTripItinerary(
  input: TripInput,
  location: { name: string; latitude: number; longitude: number },
  providerName: AIProviderName
): Promise<GeneratedTrip> {
  const durationDays = tripLengthDays(input.startDate, input.endDate);
  const dates = Array.from({ length: durationDays }, (_, i) => addDays(input.startDate, i));
  const { travelStyle } = input;

  const system = `
You are TripForge, a world-class premium AI travel planner.
Generate a structured, extremely realistic itinerary for the requested trip.
Ensure realistic travel times between places, logical geographical routing to minimize transport time, and accurate cost estimates in ${input.budgetCurrency}.
Use real, existing places with accurate latitude/longitude.
All times must be 24-hour format (e.g. 09:00, 14:30).
Write every human-readable string (titles, summary, names, descriptions) in ${LANGUAGE_NAMES[input.language] ?? "English"}.
`;

  const prompt = `
Destination: ${input.destination} (centre ≈ ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})
Duration: ${durationDays} days — produce exactly one entry per date: ${dates.join(", ")}
Budget: ${input.budgetAmount} ${input.budgetCurrency}
Interests: ${input.interests.length ? input.interests.join(", ") : "a balanced mix"}
Vibe:
- Relaxed (0) vs Adventure (100): ${travelStyle.relaxedToAdventure}
- Budget (0) vs Luxury (100): ${travelStyle.budgetToLuxury}
- Nature (0) vs City (100): ${travelStyle.natureToCity}
`;

  const { output } = await generateText({
    model: resolveModel(providerName),
    output: Output.object({ schema: GeneratedTripSchema }),
    system,
    prompt,
  });

  // Models occasionally return more days than asked; pin them to the requested dates.
  return {
    ...output,
    days: output.days.slice(0, durationDays).map((day, i) => ({ ...day, date: dates[i] })),
  };
}
