import { Request, Response, NextFunction } from 'express';
import { db, User } from './db.ts';

// --- Mock Token Store ---
// In-memory store: token -> userId
const tokenStore: Record<string, string> = {};

// --- Helper Functions ---

export const generateToken = (userId: string): string => {
  const token = `mock-token-${Math.random().toString(36).substring(2)}-${Date.now()}`;
  tokenStore[token] = userId;
  return token;
};

export const removeToken = (token: string) => {
  delete tokenStore[token];
};

export const getUserIdByToken = (token: string): string | undefined => {
  return tokenStore[token];
};

// --- Middleware ---

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const userId = getUserIdByToken(token);

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
  }

  req.user = user;
  next();
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
  next();
};
