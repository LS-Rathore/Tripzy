import express from 'express';
import type { Response } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, type AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get expenses for a trip
router.get('/:tripId/expenses', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.tripId as string;
    
    // Verify access
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user!.id }
    });
    
    if (!trip) {
      res.status(404).json({ error: 'Trip not found or unauthorized' });
      return;
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(expenses);
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add an expense
router.post('/:tripId/expenses', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.tripId as string;
    const { description, amount, paidBy, splitAmong } = req.body;
    
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user!.id }
    });
    
    if (!trip) {
      res.status(404).json({ error: 'Trip not found or unauthorized' });
      return;
    }

    if (!description || !amount || !paidBy || !splitAmong || splitAmong.length === 0) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        description,
        amount: Number(amount),
        paidBy,
        splitAmong
      }
    });

    res.json(expense);
  } catch (error: any) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Delete an expense
router.delete('/:tripId/expenses/:expenseId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.tripId as string;
    const expenseId = req.params.expenseId as string;
    
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user!.id }
    });
    
    if (!trip) {
      res.status(404).json({ error: 'Trip not found or unauthorized' });
      return;
    }

    await prisma.expense.delete({
      where: { id: expenseId, tripId }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Update trip members
router.post('/:tripId/members', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.tripId as string;
    const { members } = req.body;
    
    if (!Array.isArray(members)) {
      res.status(400).json({ error: 'Members must be an array' });
      return;
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user!.id }
    });
    
    if (!trip) {
      res.status(404).json({ error: 'Trip not found or unauthorized' });
      return;
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: { members }
    });

    res.json({ success: true, members: updatedTrip.members });
  } catch (error: any) {
    console.error('Error updating members:', error);
    res.status(500).json({ error: 'Failed to update members' });
  }
});

export default router;
