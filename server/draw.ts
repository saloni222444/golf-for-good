import { db, Draw, Winner, Score } from './db.ts';
import { distributePrizes } from './prize.ts';
import { distributeCharityPool } from './charity.ts';

// --- Utility Functions ---

/**
 * Generates 5 unique random numbers between 1 and 45.
 */
export const generateUniqueNumbers = (): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < 5) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * Calculates how many user scores match the draw numbers.
 * Algorithm: Convert user scores to a Set, then find intersection with draw numbers.
 */
export const calculateMatches = (userScores: number[], drawNumbers: number[]): number => {
  const scoreSet = new Set(userScores);
  let matches = 0;
  for (const num of drawNumbers) {
    if (scoreSet.has(num)) {
      matches++;
    }
  }
  return matches;
};

/**
 * Determines the prize category based on match count.
 */
export const determinePrizeCategory = (matchCount: number): Winner['prizeCategory'] => {
  if (matchCount === 5) return 'JACKPOT';
  if (matchCount === 4) return 'HIGH';
  if (matchCount === 3) return 'MEDIUM';
  return 'NONE';
};

// --- Business Logic ---

/**
 * Creates a new draw for the specified month.
 */
export const createDraw = (month: string): Draw => {
  const numbers = generateUniqueNumbers();
  const draw = db.createDraw({
    drawMonth: month,
    numbers,
    status: 'completed',
  });
  return draw;
};

/**
 * Matches all active users' scores against a specific draw and generates winner records.
 * Then calls the prize distribution system to calculate and assign rewards.
 */
export const matchDraw = (drawId: string) => {
  const draws = db.getDraws();
  const draw = draws.find(d => d.id === drawId);
  if (!draw) throw new Error('Draw not found');

  // Clear any existing winners for this draw to avoid duplicates if re-run
  const existingWinners = db.getWinners().filter(w => w.drawId === drawId);
  if (existingWinners.length > 0) {
    db.updateTable('winners', db.getWinners().filter(w => w.drawId !== drawId));
  }

  const users = db.getUsers();

  for (const user of users) {
    // Only match for users with active subscriptions
    if (!db.checkActiveSubscription(user.id)) continue;

    const scores = db.getUserScores(user.id);
    if (scores.length === 0) continue;

    // Get unique scores from the user's latest 5 rounds
    const scoreValues = scores.map(s => s.score);
    const matchCount = calculateMatches(scoreValues, draw.numbers);
    const category = determinePrizeCategory(matchCount);

    if (category !== 'NONE') {
      db.createWinner({
        userId: user.id,
        drawId: draw.id,
        matchCount,
        prizeCategory: category,
        prizeAmount: 0, // Will be calculated by distributePrizes
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Now distribute the prizes based on the winners created
  const distributionResults = distributePrizes(drawId);

  // Distribute charity funds from the pool calculated during prize distribution
  if (distributionResults.charityContribution > 0) {
    distributeCharityPool(distributionResults.charityContribution);
  }

  return distributionResults;
};

/**
 * Gets all draws sorted by latest first.
 */
export const getDrawHistory = (): Draw[] => {
  return db.getDraws().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
