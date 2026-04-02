import { db, Winner } from './db.ts';

// --- Constants ---
const SUBSCRIPTION_PRIZE_CONTRIBUTION = 100; // Fixed amount per active user
const CHARITY_CONTRIBUTION_PER_SUB = 20;     // Fixed amount per active user for charity
const ALLOCATION = {
  JACKPOT: 0.40, // 5 matches
  HIGH: 0.35,    // 4 matches
  MEDIUM: 0.25,  // 3 matches
};

// --- Utility Functions ---

/**
 * Calculates the total prize pool based on active subscriptions.
 */
export const calculatePrizePool = (activeCount: number): number => {
  return activeCount * SUBSCRIPTION_PRIZE_CONTRIBUTION;
};

/**
 * Calculates the total charity contribution based on active subscriptions.
 */
export const calculateCharityContribution = (activeCount: number): number => {
  return activeCount * CHARITY_CONTRIBUTION_PER_SUB;
};

/**
 * Splits a category's allocation equally among winners.
 */
export const splitEquallyAmongWinners = (amount: number, count: number): number => {
  if (count <= 0) return 0;
  return Math.floor((amount / count) * 100) / 100; // Round to 2 decimal places
};

/**
 * Handles the prize distribution for a draw.
 * Logic:
 * 1. Calculate total pool (Active Subs * 100 + previous Jackpot)
 * 2. Group winners by category
 * 3. For each category:
 *    - If winners exist: Split allocation equally, update status to 'paid'
 *    - If no winners: Add allocation to next month's rollover
 * 4. Update database once
 */
export const distributePrizes = (drawId: string) => {
  const allWinners = db.getWinners();
  const currentDrawWinners = allWinners.filter(w => w.drawId === drawId);
  const activeSubs = db.getSubscriptions().filter(s => s.status === 'active');
  const config = db.getConfig();

  const basePool = calculatePrizePool(activeSubs.length);
  const charityContribution = calculateCharityContribution(activeSubs.length);
  const totalPool = basePool + config.jackpotPool;

  const groupedWinners = {
    JACKPOT: currentDrawWinners.filter(w => w.prizeCategory === 'JACKPOT'),
    HIGH: currentDrawWinners.filter(w => w.prizeCategory === 'HIGH'),
    MEDIUM: currentDrawWinners.filter(w => w.prizeCategory === 'MEDIUM'),
  };

  const distributionResults: any = {
    drawId,
    totalPool,
    basePool,
    charityContribution,
    rolloverFromPrevious: config.jackpotPool,
    categories: {},
    newRollover: 0,
  };

  let totalRollover = 0;
  const updatedWinners = [...allWinners];

  // Helper to process a category
  const processCategory = (category: keyof typeof ALLOCATION) => {
    const winners = groupedWinners[category];
    const allocation = totalPool * ALLOCATION[category];
    let prizePerWinner = 0;
    let distributed = 0;
    let categoryRollover = 0;

    if (winners.length > 0) {
      prizePerWinner = splitEquallyAmongWinners(allocation, winners.length);
      distributed = prizePerWinner * winners.length;
      
      // Update winners in the local array
      winners.forEach(w => {
        const idx = updatedWinners.findIndex(win => win.id === w.id);
        if (idx !== -1) {
          updatedWinners[idx] = { 
            ...updatedWinners[idx], 
            prizeAmount: prizePerWinner, 
            status: 'pending' 
          };
        }
      });
    } else {
      // If no winners, the whole allocation rolls over to the next jackpot
      categoryRollover = Math.floor(allocation * 100) / 100;
    }

    distributionResults.categories[category] = {
      allocation,
      winners: winners.length,
      prizePerWinner,
      distributed,
      rolledOver: categoryRollover > 0,
      rolloverAmount: categoryRollover
    };

    totalRollover += categoryRollover;
  };

  processCategory('JACKPOT');
  processCategory('HIGH');
  processCategory('MEDIUM');

  // Update the database once
  db.updateTable('winners', updatedWinners);
  db.updateConfig({ jackpotPool: totalRollover });

  distributionResults.newRollover = totalRollover;

  return distributionResults;
};
