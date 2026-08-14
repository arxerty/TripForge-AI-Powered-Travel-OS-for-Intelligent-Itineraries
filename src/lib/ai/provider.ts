import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { GeneratedTripSchema } from "@/lib/validation/trip.schema";

export type AIProviderName = "openai" | "gemini";

export async function generateTripItinerary({
  destination,
  startDate,
  endDate,
  budgetAmount,
  budgetCurrency = "EUR",
  travelStyle,
  interests,
  providerName = "openai",
}: {
  destination: string;
  startDate: string;
  endDate: string;
  budgetAmount: number;
  budgetCurrency?: string;
  travelStyle: {
    relaxedToAdventure: number;
    budgetToLuxury: number;
    natureToCity: number;
  };
  interests: string[];
  providerName?: AIProviderName;
}) {
  // Determine which model to use
  const model = 
    providerName === "gemini" 
      ? google("gemini-1.5-pro") 
      : openai("gpt-4o");

  const durationDays = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)));

  const systemPrompt = `
You are TripForge, a world-class premium AI travel planner.
Generate a structured, extremely realistic itinerary for the requested trip.

Constraints & Guidelines:
1. Destination: ${destination}
2. Duration: ${durationDays} days (Start: ${startDate}, End: ${endDate})
3. Budget: ${budgetAmount} ${budgetCurrency}
4. Interests: ${interests.join(", ")}
5. Vibe: 
   - Relaxed (0) vs Adventure (100): ${travelStyle.relaxedToAdventure}
   - Budget (0) vs Luxury (100): ${travelStyle.budgetToLuxury}
   - Nature (0) vs City (100): ${travelStyle.natureToCity}

Ensure realistic travel times between places, logical geographical routing to minimize transport time, and accurate cost estimates.
All times must be 24-hour format (e.g. 09:00, 14:30).
Never output markdown. Output exactly the structured JSON requested.
`;

  try {
    const { object } = await generateObject({
      model,
      schema: GeneratedTripSchema,
      prompt: systemPrompt,
      system: systemPrompt, // Some models prefer system prompt separated
    });

    return object;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate trip. Please try again.");
  }
}
