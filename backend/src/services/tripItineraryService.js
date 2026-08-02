import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import { itineraryCache } from './cacheService.js';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });
function buildItineraryPrompt(details) {
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
9. CRITICAL FOR FOOD STOPS: Every single day MUST feature unique, distinct food stops and meal options for breakfast, lunch, and dinner. Food options MUST change daily and align with the specific neighborhoods/attractions visited on that day (e.g., street food near bazaars, heritage dining near forts, relaxing cafes near gardens). DO NOT repeat the same food titles, restaurant names, or dish descriptions across different days.
10. Tone: warm, direct, like a local friend — not a listicle.

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
export async function generateTripItinerary(details) {
    // --- Cache Check ---
    const cacheKey = itineraryCache.generateKey('itinerary', {
        city: details.city.toLowerCase().trim(),
        numberOfDays: details.numberOfDays,
        budgetPerDay: details.budgetPerDay,
        travelStyle: details.travelStyle.toLowerCase().trim(),
        interests: details.interests,
        travelerType: details.travelerType.toLowerCase().trim(),
        conceptName: details.conceptName.toLowerCase().trim(),
    });
    const cached = itineraryCache.get(cacheKey);
    if (cached) {
        console.log(`[Cache HIT] Itinerary for "${details.city} - ${details.conceptName}" served from cache. Stats:`, itineraryCache.getStats());
        return cached;
    }
    console.log(`[Cache MISS] Generating fresh itinerary for "${details.city} - ${details.conceptName}"...`);
    const prompt = buildItineraryPrompt(details);
    // 1. Try Gemini
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 8192,
                    responseMimeType: 'application/json',
                },
            });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const parsed = JSON.parse(text);
            if (!parsed.days || !Array.isArray(parsed.days) || parsed.days.length === 0) {
                throw new Error('Invalid day structure returned from Gemini');
            }
            console.log('Successfully generated itinerary using Gemini.');
            itineraryCache.set(cacheKey, parsed);
            return parsed;
        }
        catch (error) {
            console.warn('Gemini AI itinerary generation failed, falling back to Groq...', error.message || error);
        }
    }
    // 2. Try Groq
    if (GROQ_API_KEY && GROQ_API_KEY !== 'gsk_your_api_key_here') {
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.5,
                max_tokens: 8192,
                response_format: { type: 'json_object' }
            });
            const text = chatCompletion.choices[0]?.message?.content || "";
            const parsed = JSON.parse(text);
            if (!parsed.days || !Array.isArray(parsed.days) || parsed.days.length === 0) {
                throw new Error('Invalid day structure returned from Groq');
            }
            console.log('Successfully generated itinerary using Groq.');
            itineraryCache.set(cacheKey, parsed);
            return parsed;
        }
        catch (error) {
            console.warn('Groq AI itinerary generation failed, falling back to Mock...', error.message || error);
        }
    }
    // 3. Fallback to Mock
    console.warn('All AI providers failed or keys missing. Falling back to mock itinerary.');
    return getMockItinerary(details);
}
function getMockItinerary(details) {
    const days = [];
    const dailyLimit = details.budgetPerDay;
    // Let's build a day-by-day mock itinerary dynamically based on duration
    for (let i = 1; i <= details.numberOfDays; i++) {
        const isFirstDay = i === 1;
        const isLastDay = i === details.numberOfDays;
        const breakfastCost = Math.round(dailyLimit * 0.05);
        const lunchCost = Math.round(dailyLimit * 0.15);
        const dinnerCost = Math.round(dailyLimit * 0.25);
        const morningCost = isFirstDay ? 0 : Math.round(dailyLimit * 0.15);
        const afternoonCost = Math.round(dailyLimit * 0.15);
        const eveningCost = isLastDay ? 0 : Math.round(dailyLimit * 0.20);
        const transCost1 = Math.round(dailyLimit * 0.05);
        const transCost2 = Math.round(dailyLimit * 0.05);
        const primaryCost = breakfastCost + lunchCost + dinnerCost + morningCost + afternoonCost + eveningCost + transCost1 + transCost2;
        days.push({
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
        });
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
//# sourceMappingURL=tripItineraryService.js.map