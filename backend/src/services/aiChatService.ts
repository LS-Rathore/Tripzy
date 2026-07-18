import { GoogleGenerativeAI } from '@google/generative-ai';

import { Groq } from 'groq-sdk';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

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
4. You have deep knowledge of the city. If they ask about a place NOT on their itinerary (like a famous nearby landmark, restaurant, or activity), enthusiastically give them the info! Use the itinerary as context, but DO NOT restrict yourself to only discussing what's on the itinerary.
5. DO NOT format your output as JSON. Just write friendly markdown text. Use emojis appropriately.
`;

  if (GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: systemPrompt
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error: any) {
      console.warn('Gemini chat failed, falling back to Groq...', error.message || error);
    }
  }

  if (GROQ_API_KEY) {
    try {
      const groqMessages = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.parts[0]?.text || ''
        })),
        { role: 'user', content: message }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages: groqMessages as any,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      });

      return chatCompletion.choices[0]?.message?.content || 'Sorry, I got confused!';
    } catch (error: any) {
      console.error('Groq Chat Error:', error);
      throw new Error('Failed to get response from Groq Local Friend AI.');
    }
  }

  throw new Error('No AI service configured.');
};
