import { Router, type Request, type Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { requireAuth, type AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const JWT_SECRET = process.env.JWT_SECRET || 'tripzy-dev-secret-change-in-production';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '');

// Helper to get OAuth client for a request
function getOAuthClient(req?: Request) {
  const envBackend = process.env.BACKEND_URL;
  let hostUrl = envBackend;
  if (!hostUrl && req) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    hostUrl = `${proto}://${req.get('host')}`;
  }
  const backendUrl = (hostUrl || 'http://localhost:5000').replace(/\/+$/, '');
  const redirectUri = `${backendUrl}/auth/google/callback`;

  return {
    client: new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri),
    redirectUri,
  };
}

// Step 1: Redirect user to Google's OAuth consent screen
router.get('/google', (req: Request, res: Response) => {
  const { client } = getOAuthClient(req);
  const authorizeUrl = client.generateAuthUrl({
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
    const { client, redirectUri } = getOAuthClient(req);
    // Exchange code for tokens with explicit redirect_uri matching authorize call
    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirectUri,
    });
    client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await client.verifyIdToken({
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

    const isCrossSite = process.env.NODE_ENV === 'production' || Boolean(process.env.BACKEND_URL?.startsWith('https'));

    // Set httpOnly cookie
    res.cookie('tripzy_token', token, {
      httpOnly: true,
      secure: isCrossSite,
      sameSite: isCrossSite ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    // Redirect to frontend
    res.redirect(`${FRONTEND_URL}/plan`);
  } catch (error: any) {
    console.error('Google OAuth error:', error?.message || error);
    const reason = encodeURIComponent(error?.message || 'oauth_failed');
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed&reason=${reason}`);
  }
});

// Get current authenticated user
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// Logout — clear the cookie
router.post('/logout', (_req: Request, res: Response) => {
  const isCrossSite = process.env.NODE_ENV === 'production' || Boolean(process.env.BACKEND_URL?.startsWith('https'));
  res.clearCookie('tripzy_token', {
    httpOnly: true,
    secure: isCrossSite,
    sameSite: isCrossSite ? 'none' : 'lax',
    path: '/',
  });
  res.json({ message: 'Logged out' });
});

export default router;
