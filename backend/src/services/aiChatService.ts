import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const generateLocalFriendResponse = async (
  message: string,
  history: ChatMessage[],
  tripContext: any,
  activeDay: number
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Find the specific day plan the user is looking at
  const activeDayPlan = tripContext.rawItinerary?.days?.find((d: any) => d.day === activeDay);

  const systemPrompt = `You are "Tripzy Local Friend", an enthusiastic, deeply knowledgeable, and highly localized AI concierge for a traveler visiting ${tripContext.city}.
Your goal is to provide concise, practical, and highly specific local advice.

Here is the traveler's context:
- Destination: ${tripContext.city}
- Travel Style: ${tripContext.travelStyle}
- Traveler Type: ${tripContext.travelerType}
- Budget: ₹${tripContext.budgetPerDay} per day
- Trip Concept: ${tripContext.conceptName} (${tripContext.conceptVibe})

The traveler is currently looking at Day ${activeDay} of their itinerary.
Here is what they have planned for Day ${activeDay}:
${JSON.stringify(activeDayPlan, null, 2)}

Rules for your response:
1. Be concise. Do not write essays. Keep it to 2-3 short paragraphs max.
2. Be practical. If they ask about transport, mention rickshaws, metro, or typical fare estimates in INR.
3. Be specific to the city. Use local slang sparingly but correctly if it fits the vibe.
4. If they ask about something related to their current day's plan, reference their planned activities!
5. DO NOT format your output as JSON. Just write friendly markdown text. Use emojis appropriately.
`;

  // We use gemini-1.5-flash for faster chat responses
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: {
      role: 'system',
      parts: [{ text: systemPrompt }]
    }
  });

  const chat = model.startChat({
    history: history,
  });

  try {
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    throw new Error('Failed to get response from Local Friend AI.');
  }
};
