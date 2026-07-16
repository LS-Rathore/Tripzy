import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface TripItineraryDetails {
  city: string;
  startingFrom?: string;
  numberOfDays: number;
  budgetPerDay: number;
  travelStyle: string;
  interests: string[];
  travelerType: string;
  conceptName: string;
  conceptVibe: string;
}

interface ItineraryOption {
  title: string;
  location: string;
  cost: number;
  tag: 'Popular' | 'Hidden Gem' | 'Budget-Friendly' | 'Highly Rated';
  reason: string;
}

interface SlotOptions {
  options: ItineraryOption[];
}

interface TransportLeg {
  from: string;
  to: string;
  mode: string;
  cost: number;
}

interface PrimaryDayPlan {
  label: 'Primary';
  dailyCost: number;
  morning: SlotOptions;
  afternoon: SlotOptions;
  evening: SlotOptions;
  food: {
    breakfast: SlotOptions;
    lunch: SlotOptions;
    dinner: SlotOptions;
  };
  transport: TransportLeg[];
}

interface AlternativeDayPlan {
  label: string; // e.g. "Alternative: Museum & Culture Focused"
  dailyCost: number;
  summary: string;
}

interface DayItinerary {
  day: number;
  dayPlans: [PrimaryDayPlan, AlternativeDayPlan, AlternativeDayPlan];
}

interface ItineraryResponse {
  days: DayItinerary[];
  totalEstimate: number;
  budgetFlag: {
    isRealistic: boolean;
    note: string;
  };
  bestTimeToVisit: string;
  thingsToAvoid: string[];
}

function buildItineraryPrompt(details: TripItineraryDetails): string {
  const totalBudget = details.budgetPerDay * details.numberOfDays;

  return `You are an expert local travel planner with deep, first-hand knowledge of Indian cities.
A traveler has already chosen a trip concept. Now build their full day-by-day itinerary for that concept, with multiple options at every decision point so they can personalize the final plan themselves.

TRIP DETAILS:
- Destination: ${details.city}
- Starting from: ${details.startingFrom || 'Not specified'}
- Duration: ${details.numberOfDays} days
- Daily budget: ₹${details.budgetPerDay}
- Stated total budget: ₹${totalBudget}
- Travel style: ${details.travelStyle}
- Interests: ${details.interests.join(', ')}
- Traveler type: ${details.travelerType}
- Selected concept: ${details.conceptName}
- Concept vibe: ${details.conceptVibe}

INSTRUCTIONS:
1. Treat Day 1 and the final day as partial days (arrival/departure buffer).
2. For each day, generate ONE primary day plan PLUS 2 alternative full-day plans (genuinely different in nature — e.g. one indoor/museum-heavy alternative, one outdoor/nature-heavy alternative — not minor variations of the same plan).
3. Within the PRIMARY plan only, for each time slot (morning, afternoon, evening) and each meal (breakfast, lunch, dinner), provide 2-3 options. The alternative day plans do not need per-slot options — they are already alternatives at the day level.
4. For every option (activity or food), include: title, location, estimated cost in ₹, a tag (one of: "Popular", "Hidden Gem", "Budget-Friendly", "Highly Rated"), and a short one-line reason why it's suggested.
5. Include transport legs between locations for the primary plan, with mode and cost.
6. Give a per-day cost total (based on the first/default option in each slot) and a full-trip total.
7. Flag if the stated budget is unrealistic for this city/style/concept.
8. State best time of year to visit and 2-3 things to avoid.
9. Tone: warm, direct, like a local friend — not a listicle.

OUTPUT FORMAT: Return ONLY valid JSON, no markdown, no commentary, no code fences, matching this schema:
{
  "days": [
    {
      "day": 1,
      "dayPlans": [
        {
          "label": "Primary",
          "dailyCost": 0,
          "morning": {
            "options": [
              { "title": "Visit Hawa Mahal", "location": "Jaipur Old City", "cost": 200, "tag": "Popular", "reason": "Best caught in the early morning light." },
              { "title": "Hot Air Balloon ride", "location": "Amber", "cost": 8000, "tag": "Highly Rated", "reason": "Incredible views of the forts at sunrise." }
            ]
          },
          "afternoon": {
            "options": [
              { "title": "Amber Fort exploration", "location": "Amber Hill", "cost": 500, "tag": "Highly Rated", "reason": "Explore the royal halls and mirrors." }
            ]
          },
          "evening": {
            "options": [
              { "title": "Stroll down Johri Bazaar", "location": "Pink City", "cost": 0, "tag": "Popular", "reason": "Excellent street food and traditional textiles." }
            ]
          },
          "food": {
            "breakfast": {
              "options": [
                { "title": "Pyaz Kachori & Lassi", "location": "Rawat Mishthan Bhandar", "cost": 150, "tag": "Popular", "reason": "Famous spicy Jaipur specialty." }
              ]
            },
            "lunch": {
              "options": [
                { "title": "Rajasthani Thali", "location": "LMB Restaurant", "cost": 600, "tag": "Highly Rated", "reason": "Massive variety of local curries." }
              ]
            },
            "dinner": {
              "options": [
                { "title": "Tandoori Specialties", "location": "Handi Restaurant", "cost": 400, "tag": "Popular", "reason": "Traditional open-pot mutton and paneer." }
              ]
            }
          },
          "transport": [
            { "from": "Hotel", "to": "Hawa Mahal", "mode": "Auto Rickshaw", "cost": 100 },
            { "from": "Hawa Mahal", "to": "Amber Fort", "mode": "Cab", "cost": 300 }
          ]
        },
        {
          "label": "Alternative: Museum & Culture Focused",
          "dailyCost": 500,
          "summary": "Skip the forts and focus on heritage museums. Start with Albert Hall Museum, grab a traditional lunch, and explore the Anokhi Museum of Hand Printing."
        },
        {
          "label": "Alternative: Nature & Outdoors Focused",
          "dailyCost": 200,
          "summary": "Focus on Jaipur's natural heights. Hike up to the Sun Temple at Galtaji (Monkey Temple) in the morning, followed by a quiet afternoon at Jal Mahal, and sunset at Nahargarh Hills."
        }
      ]
    }
  ],
  "totalEstimate": 0,
  "budgetFlag": { "isRealistic": true, "note": "" },
  "bestTimeToVisit": "",
  "thingsToAvoid": []
}`;
}

export async function generateTripItinerary(details: TripItineraryDetails): Promise<ItineraryResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.5, // slightly lower temp for more structured plans
      maxOutputTokens: 8192, // large token limit for full itineraries
      responseMimeType: 'application/json',
    },
  });

  const prompt = buildItineraryPrompt(details);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed: ItineraryResponse = JSON.parse(text);

    // Validate structure basics
    if (!parsed.days || !Array.isArray(parsed.days) || parsed.days.length === 0) {
      throw new Error('Invalid day structure returned from AI');
    }

    return parsed;
  } catch (parseError) {
    console.error('Failed to parse AI itinerary response:', text);
    throw new Error('Failed to parse itinerary details from AI response');
  }
}
