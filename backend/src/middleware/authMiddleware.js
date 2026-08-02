import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'tripzy-dev-secret-change-in-production';
export function requireAuth(req, res, next) {
    const token = req.cookies?.tripzy_token;
    if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=authMiddleware.js.map