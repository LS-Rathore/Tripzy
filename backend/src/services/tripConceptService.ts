import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import { conceptCache } from './cacheService.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

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
  // --- Cache Check ---
  const cacheKey = conceptCache.generateKey('concepts', {
    city: trip.city.toLowerCase().trim(),
    numberOfDays: trip.numberOfDays,
    budgetPerDay: trip.budgetPerDay,
    travelStyle: trip.travelStyle.toLowerCase().trim(),
    interests: trip.interests,
    travelerType: trip.travelerType.toLowerCase().trim(),
  });

  const cached = conceptCache.get<ConceptsResponse>(cacheKey);
  if (cached) {
    console.log(`[Cache HIT] Concepts for "${trip.city}" served from cache. Stats:`, conceptCache.getStats());
    return cached;
  }
  console.log(`[Cache MISS] Generating fresh concepts for "${trip.city}"...`);

  const prompt = buildPrompt(trip);

  // 1. Try Gemini
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed: ConceptsResponse = JSON.parse(text);

      if (!parsed.concepts || !Array.isArray(parsed.concepts) || parsed.concepts.length !== 3) {
        throw new Error('Invalid response structure from Gemini');
      }

      console.log('Successfully generated concepts using Gemini.');
      conceptCache.set(cacheKey, parsed);
      return parsed;
    } catch (error: any) {
      console.warn('Gemini AI generation failed, falling back to Groq...', error.message || error);
    }
  }

  // 2. Try Groq
  if (GROQ_API_KEY && GROQ_API_KEY !== 'gsk_your_api_key_here') {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: 'json_object' }
      });

      const text = chatCompletion.choices[0]?.message?.content || "";
      const parsed: ConceptsResponse = JSON.parse(text);

      if (!parsed.concepts || !Array.isArray(parsed.concepts) || parsed.concepts.length !== 3) {
        throw new Error('Invalid response structure from Groq');
      }

      console.log('Successfully generated concepts using Groq.');
      conceptCache.set(cacheKey, parsed);
      return parsed;
    } catch (error: any) {
      console.warn('Groq AI generation failed, falling back to Mock...', error.message || error);
    }
  }

  // 3. Fallback to Mock
  console.warn('All AI providers failed or keys missing. Falling back to mock concepts.');
  return getMockConcepts(trip);
}

function getMockConcepts(trip: TripDetails): ConceptsResponse {
  const totalBudget = trip.budgetPerDay * trip.numberOfDays;
  const styleStr = trip.travelStyle.toLowerCase();

  const est1 = Math.round(totalBudget * 0.7);
  const est2 = Math.round(totalBudget * 0.95);
  const est3 = Math.round(totalBudget * 1.2);

  return {
    concepts: [
      {
        id: 'relaxed-explorer',
        name: 'Relaxed Explorer',
        vibeDescription: `A laid-back exploration of ${trip.city} tailored for a ${trip.travelerType.toLowerCase()} trip. Fewer stops, longer lunches, and plenty of time to absorb the local atmosphere without rushing.`,
        estimatedTotalCost: est1,
        budgetFit: est1 <= totalBudget ? 'below' : 'exceeds',
        highlights: [
          `Lazy mornings exploring historical alleys`,
          `Traditional local lunches at heritage spots`,
          `Scenic sunsets with local tea/snacks`,
          `Handicraft market strolls`
        ],
        bestFor: 'Best if you prefer waking up late and enjoying quiet, unhurried spots.'
      },
      {
        id: 'balanced-highlights',
        name: 'Balanced Highlights',
        vibeDescription: `The perfect mix of must-see landmarks and local secrets. Experience the classic sights of ${trip.city} combined with authentic food stops and hidden neighborhoods.`,
        estimatedTotalCost: est2,
        budgetFit: est2 <= totalBudget ? 'within' : 'exceeds',
        highlights: [
          `Top-rated iconic monuments & photo ops`,
          `Authentic street food tastings`,
          `Guided cultural walk through old markets`,
          `Sunset panoramic city views`
        ],
        bestFor: 'Best for first-time visitors who want a complete overview without feeling exhausted.'
      },
      {
        id: 'packed-adventurer',
        name: 'Packed Adventurer',
        vibeDescription: `A high-intensity, action-packed plan to cover absolutely everything in ${trip.city} over ${trip.numberOfDays} days. Early mornings, active transport, and maximum sightseeing.`,
        estimatedTotalCost: est3,
        budgetFit: est3 <= totalBudget ? 'within' : 'exceeds',
        highlights: [
          `Sunrise fort/hill climb for the early light`,
          `Back-to-back monument marathon tours`,
          `Traditional dinner with a local dance performance`,
          `Late-night food bazaar exploration`
        ],
        bestFor: 'Best for energetic travelers who want to see every single spot on the map.'
      }
    ]
  };
}
