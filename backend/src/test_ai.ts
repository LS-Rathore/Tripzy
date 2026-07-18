import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const { generateLocalFriendResponse } = await import('./services/aiChatService.js');
    const history: any[] = [];
    const tripContext = {
      city: 'Paris',
      travelStyle: 'Luxury',
      travelerType: 'Couple',
      budgetPerDay: 50000,
      conceptName: 'Romantic Getaway',
      conceptVibe: 'Chill',
      rawItinerary: {
        days: [{ day: 1, slots: [] }]
      }
    };
    const message = "What should I wear?";
    
    console.log("Calling generateLocalFriendResponse...");
    const result = await generateLocalFriendResponse(message, history, tripContext, 1);
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
