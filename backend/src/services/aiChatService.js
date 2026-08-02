import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });
export const generateLocalFriendResponse = async (message, history, tripContext, activeDay) => {
    const activeDayPlan = tripContext.rawItinerary?.days?.find((d) => d.day === activeDay);
    const primaryPlan = activeDayPlan?.dayPlans?.find((p) => p.label === 'Primary') || activeDayPlan?.dayPlans?.[0];
    const daySummaryText = primaryPlan ? `
- Morning Activity: ${primaryPlan.morning?.options?.map((o) => o.title).join(' OR ') || 'N/A'}
- Afternoon Activity: ${primaryPlan.afternoon?.options?.map((o) => o.title).join(' OR ') || 'N/A'}
- Evening Activity: ${primaryPlan.evening?.options?.map((o) => o.title).join(' OR ') || 'N/A'}
- Food Stops: Breakfast (${primaryPlan.food?.breakfast?.options?.[0]?.title}), Lunch (${primaryPlan.food?.lunch?.options?.[0]?.title}), Dinner (${primaryPlan.food?.dinner?.options?.[0]?.title})
` : 'Standard sightseeing day';
    const systemPrompt = `You are "Tripzy Local Friend", a friendly, knowledgeable, and energetic local travel guide based in ${tripContext.city}.
Your mission is to give the traveler instant, authentic, and hyper-practical advice for their trip.

TRAVELER CONTEXT:
- City: ${tripContext.city} (Starting from: ${tripContext.startingFrom || 'N/A'})
- Travel Style: ${tripContext.travelStyle} | Traveler Type: ${tripContext.travelerType}
- Daily Budget: ₹${tripContext.budgetPerDay}/day
- Chosen Concept: ${tripContext.conceptName}

CURRENT VIEWING STATE:
- Currently looking at Day ${activeDay} of ${tripContext.numberOfDays}
- Planned Day ${activeDay} Highlights:${daySummaryText}

RESPONSE GUIDELINES:
1. Warm & Local Tone: Speak like a helpful resident friend — warm, enthusiastic, and direct. Use 1-2 local phrases or greetings where appropriate.
2. Short & Actionable: Keep responses under 3 brief bullet points or paragraphs. Focus on actionable details (best time to visit, approximate cost in ₹, best local transport).
3. Open Knowledge: Use their current day's plan for context, but freely suggest nearby hidden spots, street foods, or budget hacks if asked!
4. Formatting: Output cleanly in Markdown (bold key places, use bullet points, use emojis). Never output JSON.`;
    if (GEMINI_API_KEY) {
        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                systemInstruction: systemPrompt
            });
            const chat = model.startChat({ history });
            const result = await chat.sendMessage(message);
            return result.response.text();
        }
        catch (error) {
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
                messages: groqMessages,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024,
            });
            return chatCompletion.choices[0]?.message?.content || 'Sorry, I got confused!';
        }
        catch (error) {
            console.error('Groq Chat Error:', error);
            throw new Error('Failed to get response from Groq Local Friend AI.');
        }
    }
    throw new Error('No AI service configured.');
};
//# sourceMappingURL=aiChatService.js.map