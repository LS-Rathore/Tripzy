import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface TripDetails {
  city: string;
  startingFrom?: string;
  numberOfDays: number;
  budgetPerDay: number;
  travelStyle: string;
  interests: string[];
  travelerType: string;
}

interface TripConcept {
  id: string;
  name: string;
  vibeDescription: string;
  estimatedTotalCost: number;
  budgetFit: 'within' | 'below' | 'exceeds';
  highlights: string[];
  bestFor: string;
}

interface ConceptsResponse {
  concepts: TripConcept[];
}

function buildPrompt(trip: TripDetails): string {
  const totalBudget = trip.budgetPerDay * trip.numberOfDays;

  return `You are an expert local travel planner with deep, first-hand knowledge of Indian cities.
A traveler has given you their trip details. Your job is NOT to build a full itinerary yet —
instead, propose 3 distinct trip CONCEPTS so they can choose a direction before you plan
day-by-day details.

TRIP DETAILS:
- Destination: ${trip.city}
- Starting from: ${trip.startingFrom || 'Not specified'}
- Duration: ${trip.numberOfDays} days
- Budget per day: ₹${trip.budgetPerDay}
- Total budget: ₹${totalBudget}
- Travel style: ${trip.travelStyle}
- Interests: ${trip.interests.join(', ')}
- Traveler type: ${trip.travelerType}

INSTRUCTIONS:
Generate exactly 3 trip concepts, each with a genuinely different pacing/focus philosophy:
1. "Relaxed Explorer" — slower pace, more downtime, fewer stops per day, comfort-prioritized
2. "Balanced Highlights" — a mix of major must-see sights and authentic local experiences
3. "Packed Adventurer" — maximum coverage, tightly scheduled, for travelers who want to see everything

For each concept, provide:
- A short vibe description (1-2 sentences, written like a local friend's honest take, not marketing copy)
- Estimated total trip cost (realistic for the stated budget/style, in INR)
- Whether this estimated cost fits "within", is "below", or "exceeds" their stated total budget of ₹${totalBudget}
- 3-4 highlight teasers (short phrases, not full descriptions — just enough to hint at what's included)
- A one-line note on who this concept suits best (e.g. "best if you want fewer early mornings")

Do not generate full day-by-day details yet. Keep this response lightweight and fast.

OUTPUT FORMAT: Return ONLY valid JSON, no markdown, no commentary, no code fences:
{
  "concepts": [
    {
      "id": "relaxed-explorer",
      "name": "Relaxed Explorer",
      "vibeDescription": "",
      "estimatedTotalCost": 0,
      "budgetFit": "within",
      "highlights": ["", "", ""],
      "bestFor": ""
    },
    {
      "id": "balanced-highlights",
      "name": "Balanced Highlights",
      "vibeDescription": "",
      "estimatedTotalCost": 0,
      "budgetFit": "within",
      "highlights": ["", "", ""],
      "bestFor": ""
    },
    {
      "id": "packed-adventurer",
      "name": "Packed Adventurer",
      "vibeDescription": "",
      "estimatedTotalCost": 0,
      "budgetFit": "within",
      "highlights": ["", "", ""],
      "bestFor": ""
    }
  ]
}`;
}

export async function generateTripConcepts(trip: TripDetails): Promise<ConceptsResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const prompt = buildPrompt(trip);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed: ConceptsResponse = JSON.parse(text);

    // Validate structure
    if (!parsed.concepts || !Array.isArray(parsed.concepts) || parsed.concepts.length !== 3) {
      throw new Error('Invalid response structure from AI');
    }

    return parsed;
  } catch (parseError) {
    console.error('Failed to parse AI response:', text);
    throw new Error('Failed to parse trip concepts from AI response');
  }
}
