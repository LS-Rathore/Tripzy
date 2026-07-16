import { Router, type Request, type Response } from 'express';
import { generateTripConcepts } from '../services/tripConceptService.js';

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
  } catch (error) {
    console.error('Trip concepts generation error:', error);

    if (error instanceof Error && error.message === 'GEMINI_API_KEY is not configured') {
      res.status(500).json({ error: 'AI service is not configured. Please set GEMINI_API_KEY.' });
      return;
    }

    res.status(500).json({ error: 'Failed to generate trip concepts. Please try again.' });
  }
});

export default router;
