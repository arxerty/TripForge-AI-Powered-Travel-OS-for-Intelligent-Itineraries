import { NextResponse } from "next/server";
import { generateTripItinerary } from "@/lib/ai/provider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In a real app, we would validate `body` with Zod before proceeding
    const { 
      destination, 
      startDate, 
      endDate, 
      budgetAmount, 
      travelStyle, 
      interests 
    } = body;

    if (!destination || !startDate || !endDate || !budgetAmount) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const tripData = await generateTripItinerary({
      destination,
      startDate,
      endDate,
      budgetAmount,
      travelStyle,
      interests,
      providerName: process.env.GEMINI_API_KEY ? "gemini" : "openai", // fallback logic
    });

    return NextResponse.json({ success: true, trip: tripData });
  } catch (error: any) {
    console.error("[TRIP_GENERATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate the trip itinerary." },
      { status: 500 }
    );
  }
}
