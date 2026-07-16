import { Router, type Request, type Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { requireAuth, type AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const JWT_SECRET = process.env.JWT_SECRET || 'tripzy-dev-secret-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${BACKEND_URL}/auth/google/callback`
);

// Step 1: Redirect user to Google's OAuth consent screen
router.get('/google', (_req: Request, res: Response) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
  });
  res.redirect(authorizeUrl);
});

// Step 2: Handle the OAuth callback
router.get('/google/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    res.redirect(`${FRONTEND_URL}/login?error=no_code`);
    return;
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      res.redirect(`${FRONTEND_URL}/login?error=invalid_token`);
      return;
    }

    // Find or create user in DB
    const user = await prisma.user.upsert({
      where: { googleId: payload.sub },
      update: {
        name: payload.name || 'Traveler',
        email: payload.email,
        avatar: payload.picture || null,
      },
      create: {
        googleId: payload.sub,
        name: payload.name || 'Traveler',
        email: payload.email,
        avatar: payload.picture || null,
      },
    });

    // Create JWT
    const jwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '7d' });

    // Set httpOnly cookie
    res.cookie('tripzy_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    // Redirect to frontend
    res.redirect(`${FRONTEND_URL}/plan`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
});

// Get current authenticated user
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// Logout — clear the cookie
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('tripzy_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ message: 'Logged out' });
});

export default router;
