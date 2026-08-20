import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import { itineraryCache } from './cacheService.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

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

type DayItineraryWithMeta = DayItinerary & {
  bestTimeToVisit?: string;
  thingsToAvoid?: string[];
};

async function retryOnce<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: any) => boolean,
  delayMs: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (shouldRetry(error)) {
      await new Promise((res) => setTimeout(res, delayMs));
      return await fn();
    }
    throw error;
  }
}

function buildDayPrompt(
  details: TripItineraryDetails,
  dayNumber: number,
  isFirstDay: boolean,
  isLastDay: boolean
): string {
  const dayBudget = details.budgetPerDay;

  return `You are an expert local travel planner with deep, first-hand knowledge of Indian cities.
A traveler has already chosen a trip concept. Generate their detailed plan for Day ${dayNumber} of their ${details.numberOfDays}-day trip, with multiple options at every decision point so they can personalize the plan.

TRIP DETAILS:
- Destination: ${details.city}
- Starting from: ${details.startingFrom || 'Not specified'}
- Day to plan: Day ${dayNumber} of ${details.numberOfDays}
- Daily budget for this day: ₹${dayBudget}
- Travel style: ${details.travelStyle}
- Interests: ${details.interests.join(', ')}
- Traveler type: ${details.travelerType}
- Selected concept: ${details.conceptName}
- Concept vibe: ${details.conceptVibe}
- Day nature: ${isFirstDay ? 'Arrival day (include check-in/settle-in buffer in morning)' : isLastDay ? 'Departure day (include packing/transit buffer in evening)' : 'Full exploration day'}

INSTRUCTIONS:
1. For Day ${dayNumber}, generate ONE primary day plan PLUS 2 alternative full-day plans (genuinely different in nature — e.g. one indoor/museum-heavy alternative, one outdoor/nature-heavy alternative — not minor variations of the same plan).
2. Within the PRIMARY plan only, for each time slot (morning, afternoon, evening) and each meal (breakfast, lunch, dinner), provide 2-3 options. The alternative day plans do not need per-slot options — they are already alternatives at the day level.
3. For every option (activity or food), include: title, location, estimated cost in ₹, a tag (one of: "Popular", "Hidden Gem", "Budget-Friendly", "Highly Rated"), and a short one-line reason why it's suggested.
4. Include transport legs between locations for the primary plan, with mode and cost.
5. Give a per-day cost total (dailyCost) for the primary plan based on the first/default option in each slot.
6. CRITICAL FOR FOOD STOPS: This day MUST feature unique, distinct food stops and meal options for breakfast, lunch, and dinner that align specifically with the neighborhoods/attractions visited on Day ${dayNumber} (e.g. street food near bazaars, heritage dining near forts, relaxing cafes near gardens). DO NOT provide generic placeholders.
7. Tone: warm, direct, like a local friend — not a listicle.
${dayNumber === 1 ? '8. Also state the overall best time of year to visit this destination ("bestTimeToVisit") and 2-3 things to avoid ("thingsToAvoid").' : ''}

OUTPUT FORMAT: Return ONLY valid JSON, no markdown, no commentary, no code fences, matching this schema:
{
  "day": ${dayNumber},
  "dayPlans": [
    {
      "label": "Primary",
      "dailyCost": 0,
      "morning": {
        "options": [
          { "title": "Activity name", "location": "Location name", "cost": 200, "tag": "Popular", "reason": "Why it is recommended" },
          { "title": "Alternative morning activity", "location": "Location name", "cost": 500, "tag": "Highly Rated", "reason": "Why it is recommended" }
        ]
      },
      "afternoon": {
        "options": [
          { "title": "Afternoon activity", "location": "Location name", "cost": 300, "tag": "Popular", "reason": "Why it is recommended" }
        ]
      },
      "evening": {
        "options": [
          { "title": "Evening activity", "location": "Location name", "cost": 0, "tag": "Hidden Gem", "reason": "Why it is recommended" }
        ]
      },
      "food": {
        "breakfast": {
          "options": [
            { "title": "Breakfast dish or cafe", "location": "Place name", "cost": 150, "tag": "Popular", "reason": "Why it is recommended" }
          ]
        },
        "lunch": {
          "options": [
            { "title": "Lunch restaurant or thali", "location": "Place name", "cost": 400, "tag": "Highly Rated", "reason": "Why it is recommended" }
          ]
        },
        "dinner": {
          "options": [
            { "title": "Dinner spot", "location": "Place name", "cost": 500, "tag": "Popular", "reason": "Why it is recommended" }
          ]
        }
      },
      "transport": [
        { "from": "Hotel / Starting Point", "to": "First Attraction", "mode": "Auto Rickshaw", "cost": 100 },
        { "from": "First Attraction", "to": "Second Attraction", "mode": "Cab", "cost": 200 }
      ]
    },
    {
      "label": "Alternative: Museum & Culture Focused",
      "dailyCost": 500,
      "summary": "Full summary of the cultural alternative route for Day ${dayNumber}."
    },
    {
      "label": "Alternative: Nature & Outdoors Focused",
      "dailyCost": 300,
      "summary": "Full summary of the nature/outdoors alternative route for Day ${dayNumber}."
    }
  ]${dayNumber === 1 ? `,\n  "bestTimeToVisit": "Best months to visit",\n  "thingsToAvoid": ["Tip 1", "Tip 2"]` : ''}
}`;
}

async function generateSingleDayPlan(
  details: TripItineraryDetails,
  dayNumber: number,
  isFirstDay: boolean,
  isLastDay: boolean
): Promise<DayItineraryWithMeta> {
  const prompt = buildDayPrompt(details, dayNumber, isFirstDay, isLastDay);

  // 1. Try Gemini
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const parsed = await retryOnce<DayItineraryWithMeta>(
        async () => {
          const model = genAI.getGenerativeModel({
            model: 'gemini-3.6-flash',
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 32768,
              responseMimeType: 'application/json',
            },
          });

          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const res: DayItineraryWithMeta = JSON.parse(text);

          if (!res.dayPlans || !Array.isArray(res.dayPlans) || (res.dayPlans as any[]).length === 0) {
            throw new Error(`Invalid dayPlans structure returned for Day ${dayNumber}`);
          }
          return res;
        },
        (err) => {
          const msg = (err?.message || '').toLowerCase();
          return msg.includes('503') || msg.includes('service unavailable') || msg.includes('overloaded');
        },
        1000
      );

      console.log(`Day ${dayNumber}: generated via Gemini`);
      return parsed;
    } catch (error: any) {
      console.warn(`Day ${dayNumber}: Gemini failed (${error.message || error}), falling back to Groq...`);
    }
  }

  // 2. Try Groq
  if (GROQ_API_KEY && GROQ_API_KEY !== 'gsk_your_api_key_here') {
    try {
      const parsed = await retryOnce<DayItineraryWithMeta>(
        async () => {
          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'openai/gpt-oss-120b',
            temperature: 0.5,
            max_tokens: 6000,
            response_format: { type: 'json_object' }
          });

          const text = chatCompletion.choices[0]?.message?.content || '';
          const res: DayItineraryWithMeta = JSON.parse(text);

          if (!res.dayPlans || !Array.isArray(res.dayPlans) || (res.dayPlans as any[]).length === 0) {
            throw new Error(`Invalid dayPlans structure returned for Day ${dayNumber}`);
          }
          return res;
        },
        (err) => {
          const msg = (err?.message || '').toLowerCase();
          return msg.includes('json_validate_failed') || msg.includes('rate_limit') || msg.includes('429');
        },
        1000
      );

      console.log(`Day ${dayNumber}: generated via Groq`);
      return parsed;
    } catch (error: any) {
      console.warn(`Day ${dayNumber}: Groq failed (${error.message || error}), falling back to mock...`);
    }
  }

  // 3. Fallback to mock
  console.warn(`Day ${dayNumber}: fell back to mock`);
  return getMockDayPlan(details, dayNumber, isFirstDay, isLastDay);
}

export interface DayOneResult {
  day1: DayItinerary;
  meta: {
    bestTimeToVisit: string;
    thingsToAvoid: string[];
  };
  cachedFull?: ItineraryResponse;
}

export async function generateDayOneItinerary(details: TripItineraryDetails): Promise<DayOneResult> {
  const cacheKey = itineraryCache.generateKey('itinerary', {
    city: details.city.toLowerCase().trim(),
    numberOfDays: details.numberOfDays,
    budgetPerDay: details.budgetPerDay,
    travelStyle: details.travelStyle.toLowerCase().trim(),
    interests: details.interests,
    travelerType: details.travelerType.toLowerCase().trim(),
    conceptName: details.conceptName.toLowerCase().trim(),
  });

  const cached = itineraryCache.get<ItineraryResponse>(cacheKey);
  if (cached && cached.days && cached.days.length > 0) {
    console.log(`[Cache HIT] [Progressive Day 1] Served from cache for "${details.city} - ${details.conceptName}".`);
    return {
      day1: cached.days[0],
      meta: {
        bestTimeToVisit: cached.bestTimeToVisit,
        thingsToAvoid: cached.thingsToAvoid,
      },
      cachedFull: cached,
    };
  }

  console.log(`[Progressive] Generating Day 1 for "${details.city} - ${details.conceptName}"...`);
  const isLastDay = details.numberOfDays === 1;
  const day1Raw = await generateSingleDayPlan(details, 1, true, isLastDay);

  const bestTimeToVisit =
    day1Raw.bestTimeToVisit && typeof day1Raw.bestTimeToVisit === 'string' && day1Raw.bestTimeToVisit.trim()
      ? day1Raw.bestTimeToVisit
      : 'October to March (for pleasant winter weather)';

  const thingsToAvoid =
    Array.isArray(day1Raw.thingsToAvoid) && day1Raw.thingsToAvoid.length > 0
      ? day1Raw.thingsToAvoid
      : [
          `Avoid unmetered local cabs — negotiate rates beforehand.`,
          `Skip street food stalls that don't have active local queues.`,
          `Stay hydrated and avoid heavy outdoor climbs between 12 PM and 3 PM.`
        ];

  const { bestTimeToVisit: _b, thingsToAvoid: _t, ...day1 } = day1Raw;

  console.log(`[Progressive] Milestone: Day 1 delivered to client for "${details.city} - ${details.conceptName}"`);

  return {
    day1,
    meta: {
      bestTimeToVisit,
      thingsToAvoid,
    },
  };
}

export async function generateRemainingDaysItinerary(
  details: TripItineraryDetails,
  day1: DayItinerary,
  meta: { bestTimeToVisit: string; thingsToAvoid: string[] }
): Promise<ItineraryResponse> {
  const cacheKey = itineraryCache.generateKey('itinerary', {
    city: details.city.toLowerCase().trim(),
    numberOfDays: details.numberOfDays,
    budgetPerDay: details.budgetPerDay,
    travelStyle: details.travelStyle.toLowerCase().trim(),
    interests: details.interests,
    travelerType: details.travelerType.toLowerCase().trim(),
    conceptName: details.conceptName.toLowerCase().trim(),
  });

  const cached = itineraryCache.get<ItineraryResponse>(cacheKey);
  if (cached && cached.days && cached.days.length === details.numberOfDays) {
    console.log(`[Cache HIT] [Progressive Remaining Days] Served full itinerary from cache for "${details.city} - ${details.conceptName}".`);
    return cached;
  }

  if (details.numberOfDays <= 1) {
    const fullResponse: ItineraryResponse = {
      days: [day1],
      totalEstimate: day1.dayPlans?.[0]?.dailyCost || 0,
      budgetFlag: {
        isRealistic: details.budgetPerDay >= 2500,
        note: details.budgetPerDay >= 2500
          ? "Your budget is perfectly aligned with the selected travel style!"
          : "₹" + details.budgetPerDay + " is a bit tight for " + details.city + ". We recommend raising your budget slightly for more comfort."
      },
      bestTimeToVisit: meta.bestTimeToVisit,
      thingsToAvoid: meta.thingsToAvoid,
    };
    itineraryCache.set(cacheKey, fullResponse);
    console.log(`[Progressive] Milestone: Full 1-day itinerary cached for "${details.city} - ${details.conceptName}"`);
    return fullResponse;
  }

  console.log(`[Progressive] Generating remaining ${details.numberOfDays - 1} days in parallel for "${details.city} - ${details.conceptName}"...`);

  const remainingPromises = Array.from({ length: details.numberOfDays - 1 }, (_, i) => {
    const dayNumber = i + 2;
    const isLastDay = dayNumber === details.numberOfDays;
    return generateSingleDayPlan(details, dayNumber, false, isLastDay);
  });

  const settledResults = await Promise.allSettled(remainingPromises);

  const remainingDays: DayItinerary[] = settledResults.map((result, idx) => {
    const dayNumber = idx + 2;
    const isLastDay = dayNumber === details.numberOfDays;
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.warn(`Day ${dayNumber} fully failed, using mock fallback. Reason:`, result.reason);
      return getMockDayPlan(details, dayNumber, false, isLastDay);
    }
  });

  const allDays = [day1, ...remainingDays];
  const totalEstimate = allDays.reduce((sum, d) => sum + (d.dayPlans?.[0]?.dailyCost || 0), 0);

  const finalResponse: ItineraryResponse = {
    days: allDays,
    totalEstimate,
    budgetFlag: {
      isRealistic: details.budgetPerDay >= 2500,
      note: details.budgetPerDay >= 2500
        ? "Your budget is perfectly aligned with the selected travel style!"
        : "₹" + details.budgetPerDay + " is a bit tight for " + details.city + ". We recommend raising your budget slightly for more comfort."
    },
    bestTimeToVisit: meta.bestTimeToVisit,
    thingsToAvoid: meta.thingsToAvoid,
  };

  itineraryCache.set(cacheKey, finalResponse);
  console.log(`[Progressive] Milestone: Full ${details.numberOfDays}-day itinerary assembled and cached for "${details.city} - ${details.conceptName}"`);
  return finalResponse;
}

export function generateFirstDayThenRest(details: TripItineraryDetails) {
  const day1Promise = generateDayOneItinerary(details);

  const restDaysPromise = day1Promise.then(async (d1Res) => {
    if (details.numberOfDays <= 1) {
      return [];
    }
    const full = await generateRemainingDaysItinerary(details, d1Res.day1, d1Res.meta);
    return full.days.slice(1);
  });

  return {
    firstDay: day1Promise.then((r) => r.day1),
    meta: day1Promise.then((r) => r.meta),
    restDays: restDaysPromise,
  };
}

export async function generateTripItinerary(details: TripItineraryDetails): Promise<ItineraryResponse> {
  const d1Res = await generateDayOneItinerary(details);
  if (d1Res.cachedFull) {
    return d1Res.cachedFull;
  }
  return await generateRemainingDaysItinerary(details, d1Res.day1, d1Res.meta);
}

function getMockDayPlan(
  details: TripItineraryDetails,
  dayNumber: number,
  isFirstDay: boolean,
  isLastDay: boolean
): DayItinerary {
  const dailyLimit = details.budgetPerDay;
  const i = dayNumber;

  const breakfastCost = Math.round(dailyLimit * 0.05);
  const lunchCost = Math.round(dailyLimit * 0.15);
  const dinnerCost = Math.round(dailyLimit * 0.25);
  const morningCost = isFirstDay ? 0 : Math.round(dailyLimit * 0.15);
  const afternoonCost = Math.round(dailyLimit * 0.15);
  const eveningCost = isLastDay ? 0 : Math.round(dailyLimit * 0.20);
  const transCost1 = Math.round(dailyLimit * 0.05);
  const transCost2 = Math.round(dailyLimit * 0.05);

  const primaryCost = breakfastCost + lunchCost + dinnerCost + morningCost + afternoonCost + eveningCost + transCost1 + transCost2;

  return {
    day: i,
    dayPlans: [
      {
        label: 'Primary',
        dailyCost: primaryCost,
        morning: {
          options: isFirstDay ? [
            {
              title: `Arrival in ${details.city} & Check-in`,
              location: `Central ${details.city}`,
              cost: 0,
              tag: 'Popular',
              reason: 'Settle in, unpack, and freshen up for your first day out.'
            }
          ] : [
            {
              title: `Iconic Landmark Tour of ${details.city}`,
              location: `Historic District`,
              cost: morningCost,
              tag: 'Highly Rated',
              reason: 'Perfect morning light for taking photos of architectural heritage.'
            },
            {
              title: `Scenic Local Walk & Photography`,
              location: `Green Ridge Path`,
              cost: Math.round(morningCost * 0.5),
              tag: 'Hidden Gem',
              reason: 'Quiet morning walk away from the bustling city crowds.'
            }
          ]
        },
        afternoon: {
          options: [
            {
              title: `Exploration of local heritage markets`,
              location: `City Center Bazaar`,
              cost: afternoonCost,
              tag: 'Popular',
              reason: 'Check out local spices, traditional fabrics, and antique shops.'
            },
            {
              title: `Quiet Afternoon Museum Tour`,
              location: `Royal Art Gallery`,
              cost: Math.round(afternoonCost * 0.8),
              tag: 'Budget-Friendly',
              reason: 'Escape the heat in fully air-conditioned galleries showcasing local history.'
            }
          ]
        },
        evening: {
          options: isLastDay ? [
            {
              title: `Final souvenirs & preparation for departure`,
              location: `Airport/Station transit area`,
              cost: 0,
              tag: 'Popular',
              reason: 'Collect your belongings and prepare for the journey back home.'
            }
          ] : [
            {
              title: `Stunning Sunset at City Viewpoint`,
              location: `Hilltop Fort`,
              cost: eveningCost,
              tag: 'Highly Rated',
              reason: 'Enjoy a panoramic view of the whole city at dusk.'
            },
            {
              title: `Traditional Cultural Show & Music`,
              location: `Open Air Theatre`,
              cost: Math.round(eveningCost * 1.2),
              tag: 'Popular',
              reason: 'Witness a performance of local dances and traditional instruments.'
            }
          ]
        },
        food: {
          breakfast: {
            options: [
              {
                title: i % 3 === 1 ? `Pyaz Kachori & Special Kulhad Chai` : i % 3 === 2 ? `Artisan Bakery & Fresh Filter Coffee` : `Classic South Indian Tiffin & Masala Dosa`,
                location: i % 3 === 1 ? `Old Town Heritage Quarter` : i % 3 === 2 ? `Arts & Cultural District` : `Market Square`,
                cost: breakfastCost,
                tag: i % 2 === 1 ? 'Highly Rated' : 'Popular',
                reason: i % 3 === 1 ? 'Iconic local breakfast spot packed with authentic morning flavors.' : i % 3 === 2 ? 'Relaxed atmosphere with fresh pastries and roasted brews.' : 'Crisp dosa and piping hot sambar served fresh from the griddle.'
              },
              {
                title: i % 2 === 0 ? `Healthy Organic Smoothie Bowl` : `Quick Continental Hotel Buffet`,
                location: `Central Avenue Cafe`,
                cost: breakfastCost,
                tag: 'Budget-Friendly',
                reason: 'Light and quick breakfast option to keep you energized for morning walks.'
              }
            ]
          },
          lunch: {
            options: [
              {
                title: i % 3 === 1 ? `Authentic Regional Thali Feast` : i % 3 === 2 ? `Historic Courtyard Garden Dining` : `Local Street Market Snack Crawl`,
                location: i % 3 === 1 ? `Heritage Fine Dining` : i % 3 === 2 ? `Palace Precincts` : `Main Bazaar Food Walk`,
                cost: lunchCost,
                tag: i % 3 === 1 ? 'Popular' : i % 3 === 2 ? 'Highly Rated' : 'Hidden Gem',
                reason: i % 3 === 1 ? 'A grand feast showcasing a wide array of authentic local curries & breads.' : i % 3 === 2 ? 'Dine in a tranquil heritage courtyard with traditional music.' : 'Sample famous local street snacks across 4 renowned food stalls.'
              },
              {
                title: i % 2 === 0 ? `Farm-to-Table Eco Bistro` : `Classic Woodfired Pizza & Pasta`,
                location: `Greenwood Park Quarter`,
                cost: Math.round(lunchCost * 1.1),
                tag: 'Highly Rated',
                reason: 'Fresh, organic ingredients crafted into comforting fusion meals.'
              }
            ]
          },
          dinner: {
            options: [
              {
                title: i % 3 === 1 ? `Royal Rooftop Dinner with Sunset Views` : i % 3 === 2 ? `Lakeside Grill & Candlelight Dining` : `Famous Night Bazaar Kebab & Biryani Trail`,
                location: i % 3 === 1 ? `Fort View Rooftop Terrace` : i % 3 === 2 ? `Waterfront Promenade` : `Old City Night Market`,
                cost: dinnerCost,
                tag: i % 3 === 1 ? 'Highly Rated' : i % 3 === 2 ? 'Popular' : 'Hidden Gem',
                reason: i % 3 === 1 ? 'Panoramic views of city lights paired with rich local delicacies.' : i % 3 === 2 ? 'Charming open-air seating right along the serene waterside.' : 'Unmatched aromatic spices and slow-cooked local recipes.'
              },
              {
                title: i % 2 === 0 ? `Live Folk Performance & Buffet` : `Cozy Craft Cafe & Dessert Parlor`,
                location: `Cultural Village`,
                cost: Math.round(dinnerCost * 0.9),
                tag: 'Budget-Friendly',
                reason: 'Enjoy local dance performances alongside a lavish evening dinner.'
              }
            ]
          }
        },
        transport: [
          {
            from: 'Starting point / Hotel',
            to: 'Sightseeing Area',
            mode: 'Auto Rickshaw',
            cost: transCost1
          },
          {
            from: 'Sightseeing Area',
            to: 'Dinner / Hotel',
            mode: 'Cab',
            cost: transCost2
          }
        ]
      },
      {
        label: 'Alternative: Museum & Culture Focused',
        dailyCost: Math.round(primaryCost * 0.8),
        summary: `Spend Day ${i} deeply exploring the cultural history. Visit the state museum, check out the handcraft guilds, and enjoy a traditional lunch in a quiet courtyard cafe.`
      },
      {
        label: 'Alternative: Nature & Outdoors Focused',
        dailyCost: Math.round(primaryCost * 0.7),
        summary: `Head out of the central town area. Hike up to the closest sunrise peak, visit local botanical reserves, and catch the sunset from a lakeside park.`
      }
    ]
  };
}

function getMockItinerary(details: TripItineraryDetails): ItineraryResponse {
  const days: DayItinerary[] = [];

  // Let's build a day-by-day mock itinerary dynamically based on duration
  for (let i = 1; i <= details.numberOfDays; i++) {
    days.push(getMockDayPlan(details, i, i === 1, i === details.numberOfDays));
  }

  const totalEstimate = days.reduce((sum, d) => sum + d.dayPlans[0].dailyCost, 0);

  return {
    days,
    totalEstimate,
    budgetFlag: {
      isRealistic: details.budgetPerDay >= 2500,
      note: details.budgetPerDay >= 2500 
        ? "Your budget is perfectly aligned with the selected travel style!" 
        : "₹" + details.budgetPerDay + " is a bit tight for " + details.city + ". We recommend raising your budget slightly for more comfort."
    },
    bestTimeToVisit: 'October to March (for pleasant winter weather)',
    thingsToAvoid: [
      `Avoid unmetered local cabs — negotiate rates beforehand.`,
      `Skip street food stalls that don't have active local queues.`,
      `Stay hydrated and avoid heavy outdoor climbs between 12 PM and 3 PM.`
    ]
  };
}
