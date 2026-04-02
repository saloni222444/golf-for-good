import { db, Winner } from './db.ts';

/**
 * Validates if a winner's status transition is allowed.
 */
export const validateWinnerStatus = (winner: Winner, nextStatus: Winner['status']): boolean => {
  const currentStatus = winner.status;

  if (nextStatus === 'approved' || nextStatus === 'rejected') {
    return currentStatus === 'pending';
  }

  if (nextStatus === 'paid') {
    return currentStatus === 'approved';
  }

  return false;
};

/**
 * Approves a winner record.
 */
export const approveWinner = (winnerId: string) => {
  const winner = db.getWinners().find(w => w.id === winnerId);
  if (!winner) throw new Error('Winner not found');

  if (!validateWinnerStatus(winner, 'approved')) {
    throw new Error(`Cannot approve winner from status: ${winner.status}`);
  }

  return db.updateWinner(winnerId, { status: 'approved' });
};

/**
 * Rejects a winner record.
 */
export const rejectWinner = (winnerId: string) => {
  const winner = db.getWinners().find(w => w.id === winnerId);
  if (!winner) throw new Error('Winner not found');

  if (!validateWinnerStatus(winner, 'rejected')) {
    throw new Error(`Cannot reject winner from status: ${winner.status}`);
  }

  return db.updateWinner(winnerId, { status: 'rejected' });
};

/**
 * Processes payout for an approved winner.
 */
export const processPayout = (winnerId: string) => {
  const winner = db.getWinners().find(w => w.id === winnerId);
  if (!winner) throw new Error('Winner not found');

  if (!validateWinnerStatus(winner, 'paid')) {
    throw new Error(`Only approved winners can be paid. Current status: ${winner.status}`);
  }

  const paymentReference = `PAY_${Math.random().toString(36).substring(2, 8).toUpperCase()}_${Date.now()}`;

  return db.updateWinner(winnerId, { 
    status: 'paid',
    paymentReference
  });
};

/**
 * Uploads mock proof for a winner.
 */
export const uploadWinnerProof = (winnerId: string, proofUrl: string) => {
  const winner = db.getWinners().find(w => w.id === winnerId);
  if (!winner) throw new Error('Winner not found');

  return db.updateWinner(winnerId, { proofUrl });
};

/**
 * Gets all winners sorted by latest draw.
 */
export const getAllWinners = () => {
  return db.getWinners().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * Gets winners for a specific draw.
 */
export const getWinnersByDraw = (drawId: string) => {
  return db.getWinners().filter(w => w.drawId === drawId);
};
