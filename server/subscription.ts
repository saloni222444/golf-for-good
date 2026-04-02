import { Response, NextFunction } from 'express';
import { db, Subscription } from './db.ts';
import { AuthRequest } from './auth.ts';
import { updateCharityFunds } from './charity.ts';

// --- Helper Functions ---

export const calculateExpiryDate = (planType: 'monthly' | 'yearly', fromDate: Date = new Date()): Date => {
  const expiryDate = new Date(fromDate);
  if (planType === 'monthly') {
    expiryDate.setDate(expiryDate.getDate() + 30);
  } else if (planType === 'yearly') {
    expiryDate.setDate(expiryDate.getDate() + 365);
  }
  return expiryDate;
};

export const generateTransactionId = (): string => {
  return `txn_${Math.random().toString(36).substring(2, 8).toUpperCase()}_${Date.now()}`;
};

// --- Middleware ---

export const requireActiveSubscription = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const isActive = db.checkActiveSubscription(req.user.id);
  if (!isActive) {
    return res.status(403).json({ 
      success: false, 
      message: 'Subscription required. Please activate your membership to access this feature.',
      code: 'SUBSCRIPTION_REQUIRED'
    });
  }

  next();
};

// --- Business Logic ---

export const subscribeUser = (userId: string, planType: 'monthly' | 'yearly') => {
  const existingSub = db.getSubscriptionByUserId(userId);
  
  let startDate = new Date();
  
  // If user has an active subscription, extend from current expiry
  if (existingSub && existingSub.status === 'active' && new Date(existingSub.expiryDate) > new Date()) {
    startDate = new Date(existingSub.expiryDate);
  }

  const expiryDate = calculateExpiryDate(planType, startDate);
  
  const subData: Omit<Subscription, 'id'> = {
    userId,
    planType,
    status: 'active',
    startDate: new Date().toISOString(), // Record when they paid
    expiryDate: expiryDate.toISOString(),
    transactionId: generateTransactionId(),
  };

  const subscription = db.createSubscription(subData);
  
  // Allocate a portion to charity if user has selected one
  const user = db.getUserById(userId);
  if (user?.selectedCharityId) {
    const charityAmount = planType === 'monthly' ? 5 : 50; // £5 for monthly, £50 for yearly
    updateCharityFunds(user.selectedCharityId, charityAmount);
  } else {
    // If no charity selected, allocate to the first one as default
    const charities = db.getCharities();
    if (charities.length > 0) {
      const charityAmount = planType === 'monthly' ? 5 : 50;
      updateCharityFunds(charities[0].id, charityAmount);
    }
  }

  return {
    status: 'success',
    transactionId: subData.transactionId,
    message: 'Subscription activated (Demo Mode)',
    subscription
  };
};

export const cancelSubscription = (userId: string) => {
  const sub = db.getSubscriptionByUserId(userId);
  if (!sub) return null;

  const updated = db.updateSubscription(sub.id, { status: 'expired' });
  return updated;
};

export const getSubscriptionStatus = (userId: string) => {
  const sub = db.getSubscriptionByUserId(userId);
  if (!sub) return { status: 'none', expiryDate: null };

  const isExpired = new Date(sub.expiryDate) < new Date();
  const currentStatus = isExpired ? 'expired' : sub.status;

  // Sync DB if expired
  if (isExpired && sub.status === 'active') {
    db.updateSubscription(sub.id, { status: 'expired' });
  }

  return {
    status: currentStatus,
    expiryDate: sub.expiryDate,
    planType: sub.planType
  };
};
