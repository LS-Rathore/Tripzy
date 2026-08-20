import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/db.js';
import { generateTripConcepts } from '../services/tripConceptService.js';
import {
  generateTripItinerary,
  generateDayOneItinerary,
  generateRemainingDaysItinerary,
} from '../services/tripItineraryService.js';
import { generateLocalFriendResponse } from '../services/aiChatService.js';
import { requireAuth, type AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/trips/concepts — Generate 3 trip concepts from form data
router.post('/concepts', async (req: Request, res: Response) => {
  try {
    const { city, startingFrom, numberOfDays, budgetPerDay, travelStyle, interests, travelerType } = req.body;

    // Validate required fields
    if (!city || !numberOfDays || !budgetPerDay || !travelStyle || !interests || !travelerType) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['city', 'numberOfDays', 'budgetPerDay', 'travelStyle', 'interests', 'travelerType'],
      });
      return;
    }

    if (numberOfDays < 1 || numberOfDays > 30) {
      res.status(400).json({ error: 'numberOfDays must be between 1 and 30' });
      return;
    }

    if (budgetPerDay < 0) {
      res.status(400).json({ error: 'budgetPerDay must be a positive number' });
      return;
    }

    const concepts = await generateTripConcepts({
      city,
      startingFrom: startingFrom || undefined,
      numberOfDays: Number(numberOfDays),
      budgetPerDay: Number(budgetPerDay),
      travelStyle,
      interests: Array.isArray(interests) ? interests : [interests],
      travelerType,
    });

    res.json(concepts);
  } catch (error: any) {
    console.error('Trip concepts generation error:', error);

    if (error instanceof Error && error.message === 'GEMINI_API_KEY is not configured') {
      res.status(500).json({ error: 'AI service is not configured. Please set GEMINI_API_KEY.' });
      return;
    }

    res.status(500).json({ error: error.message || 'Failed to generate trip concepts. Please try again.' });
  }
});

// POST /api/trips — Save a trip with chosen concept (requires authentication)
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not identified' });
      return;
    }

    const { city, startingFrom, numberOfDays, budgetPerDay, travelStyle, interests, travelerType, conceptName, conceptVibe, progressive } = req.body;

    if (!city || !numberOfDays || !budgetPerDay || !travelStyle || !interests || !travelerType || !conceptName) {
      res.status(400).json({ error: 'Missing required fields for saving trip' });
      return;
    }

    // Progressive mode: create trip shell immediately so client can fetch Day 1 right away
    if (progressive) {
      const trip = await prisma.trip.create({
        data: {
          userId,
          city,
          startingFrom: startingFrom || null,
          numberOfDays: Number(numberOfDays),
          budgetPerDay: Number(budgetPerDay),
          travelStyle,
          interests: Array.isArray(interests) ? interests : [interests],
          travelerType,
          conceptName,
          conceptVibe: conceptVibe || null,
        },
      });

      console.log(`[Route] Created progressive trip shell ${trip.id} for "${city} - ${conceptName}"`);
      res.json({ success: true, tripId: trip.id, progressive: true });
      return;
    }

    // Synchronous mode: Generate full detailed itinerary
    const rawItinerary = await generateTripItinerary({
      city,
      startingFrom: startingFrom || undefined,
      numberOfDays: Number(numberOfDays),
      budgetPerDay: Number(budgetPerDay),
      travelStyle,
      interests: Array.isArray(interests) ? interests : [interests],
      travelerType,
      conceptName,
      conceptVibe: conceptVibe || '',
    });

    const trip = await prisma.trip.create({
      data: {
        userId,
        city,
        startingFrom: startingFrom || null,
        numberOfDays: Number(numberOfDays),
        budgetPerDay: Number(budgetPerDay),
        travelStyle,
        interests: Array.isArray(interests) ? interests : [interests],
        travelerType,
        conceptName,
        conceptVibe: conceptVibe || null,
        rawItinerary: rawItinerary as any,
        totalEstimate: rawItinerary.totalEstimate,
        isBudgetRealistic: rawItinerary.budgetFlag.isRealistic,
        budgetNote: rawItinerary.budgetFlag.note,
        bestTimeToVisit: rawItinerary.bestTimeToVisit,
        thingsToAvoid: rawItinerary.thingsToAvoid,
      },
    });

    res.json({ success: true, tripId: trip.id });
  } catch (error: any) {
    console.error('Save trip error:', error);
    res.status(500).json({ error: error.message || 'Failed to save trip' });
  }
});

// POST /api/trips/:id/itinerary/day1 — Generate & deliver Day 1 + metadata progressively
router.post('/:id/itinerary/day1', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const tripId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: 'User not identified' });
      return;
    }

    if (typeof tripId !== 'string') {
      res.status(400).json({ error: 'Invalid trip ID' });
      return;
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found or unauthorized' });
      return;
    }

    // Check if trip already has rawItinerary in DB
    const existingRaw = trip.rawItinerary as any;
    if (existingRaw?.days && existingRaw.days.length > 0) {
      console.log(`[Route] Day 1 delivered from DB for trip ${trip.id}`);
      res.json({
        success: true,
        day1: existingRaw.days[0],
        meta: {
          bestTimeToVisit: trip.bestTimeToVisit || existingRaw.bestTimeToVisit || 'October to March (for pleasant winter weather)',
          thingsToAvoid: trip.thingsToAvoid?.length ? trip.thingsToAvoid : existingRaw.thingsToAvoid || [],
        },
        isComplete: existingRaw.days.length >= trip.numberOfDays,
        rawItinerary: existingRaw.days.length >= trip.numberOfDays ? existingRaw : undefined,
      });
      return;
    }

    const result = await generateDayOneItinerary({
      city: trip.city,
      startingFrom: trip.startingFrom || undefined,
      numberOfDays: trip.numberOfDays,
      budgetPerDay: trip.budgetPerDay,
      travelStyle: trip.travelStyle,
      interests: trip.interests,
      travelerType: trip.travelerType,
      conceptName: trip.conceptName || '',
      conceptVibe: trip.conceptVibe || '',
    });

    // Save partial itinerary to DB
    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        bestTimeToVisit: result.meta.bestTimeToVisit,
        thingsToAvoid: result.meta.thingsToAvoid,
        rawItinerary: result.cachedFull ? (result.cachedFull as any) : {
          days: [result.day1],
          bestTimeToVisit: result.meta.bestTimeToVisit,
          thingsToAvoid: result.meta.thingsToAvoid,
          isPartial: trip.numberOfDays > 1,
        },
      },
    });

    console.log(`[Route] Milestone: Day 1 delivered to client for trip ${trip.id}`);
    res.json({
      success: true,
      day1: result.day1,
      meta: result.meta,
      isComplete: trip.numberOfDays === 1 || !!result.cachedFull,
      rawItinerary: result.cachedFull || undefined,
    });
  } catch (error: any) {
    console.error('Progressive Day 1 error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate Day 1 itinerary' });
  }
});

// POST /api/trips/:id/itinerary/remaining-days — Generate & deliver Days 2+ and finalize trip
router.post('/:id/itinerary/remaining-days', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const tripId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: 'User not identified' });
      return;
    }

    if (typeof tripId !== 'string') {
      res.status(400).json({ error: 'Invalid trip ID' });
      return;
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found or unauthorized' });
      return;
    }

    // If trip already has complete rawItinerary (not partial and has all days)
    const existingRaw = trip.rawItinerary as any;
    if (existingRaw?.days && existingRaw.days.length === trip.numberOfDays && !existingRaw.isPartial) {
      console.log(`[Route] Remaining days already complete for trip ${trip.id}`);
      res.json({ success: true, rawItinerary: existingRaw });
      return;
    }

    // Determine Day 1 and meta
    let day1 = req.body.day1 || existingRaw?.days?.[0];
    let meta = req.body.meta || {
      bestTimeToVisit: trip.bestTimeToVisit || existingRaw?.bestTimeToVisit || 'October to March (for pleasant winter weather)',
      thingsToAvoid: trip.thingsToAvoid?.length ? trip.thingsToAvoid : existingRaw?.thingsToAvoid || [],
    };

    if (!day1) {
      // If Day 1 wasn't generated yet, generate it now
      const d1Res = await generateDayOneItinerary({
        city: trip.city,
        startingFrom: trip.startingFrom || undefined,
        numberOfDays: trip.numberOfDays,
        budgetPerDay: trip.budgetPerDay,
        travelStyle: trip.travelStyle,
        interests: trip.interests,
        travelerType: trip.travelerType,
        conceptName: trip.conceptName || '',
        conceptVibe: trip.conceptVibe || '',
      });
      day1 = d1Res.day1;
      meta = d1Res.meta;
    }

    const fullItinerary = await generateRemainingDaysItinerary(
      {
        city: trip.city,
        startingFrom: trip.startingFrom || undefined,
        numberOfDays: trip.numberOfDays,
        budgetPerDay: trip.budgetPerDay,
        travelStyle: trip.travelStyle,
        interests: trip.interests,
        travelerType: trip.travelerType,
        conceptName: trip.conceptName || '',
        conceptVibe: trip.conceptVibe || '',
      },
      day1,
      meta
    );

    // Update trip in database with completed itinerary
    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        rawItinerary: fullItinerary as any,
        totalEstimate: fullItinerary.totalEstimate,
        isBudgetRealistic: fullItinerary.budgetFlag.isRealistic,
        budgetNote: fullItinerary.budgetFlag.note,
        bestTimeToVisit: fullItinerary.bestTimeToVisit,
        thingsToAvoid: fullItinerary.thingsToAvoid,
      },
    });

    console.log(`[Route] Milestone: Full ${trip.numberOfDays}-day itinerary saved and cached for trip ${trip.id}`);
    res.json({ success: true, rawItinerary: fullItinerary });
  } catch (error: any) {
    console.error('Progressive remaining days error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate remaining days itinerary' });
  }
});

// GET /api/trips — Retrieve all trips for the authenticated user
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not identified' });
      return;
    }

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        city: true,
        numberOfDays: true,
        conceptName: true,
        createdAt: true,
      },
    });

    res.json(trips);
  } catch (error) {
    console.error('Fetch trips error:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// GET /api/trips/:id — Retrieve a trip by ID (requires authentication)
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const tripId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: 'User not identified' });
      return;
    }

    if (typeof tripId !== 'string') {
      res.status(400).json({ error: 'Invalid trip ID' });
      return;
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId, // ensure users can only access their own trips
      },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    res.json(trip);
  } catch (error) {
    console.error('Fetch trip error:', error);
    res.status(500).json({ error: 'Failed to fetch trip details' });
  }
});

// DELETE /api/trips/:id — Delete a trip by ID (requires authentication)
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const tripId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: 'User not identified' });
      return;
    }

    if (typeof tripId !== 'string') {
      res.status(400).json({ error: 'Invalid trip ID' });
      return;
    }

    // First ensure the trip belongs to the user
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId,
      },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found or unauthorized' });
      return;
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// POST /api/trips/:tripId/chat — Interact with the AI Local Friend
router.post('/:tripId/chat', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not identified' });
      return;
    }

    const { tripId } = req.params;
    const { message, history, activeDay } = req.body;

    if (!message || !activeDay) {
      res.status(400).json({ error: 'Missing message or activeDay' });
      return;
    }

    // Fetch the trip to get context
    const trip = await prisma.trip.findFirst({
      where: { id: tripId as string, userId },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    const aiResponse = await generateLocalFriendResponse(message, history || [], trip, Number(activeDay));
    
    res.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with Local Friend.' });
  }
});

export default router;
