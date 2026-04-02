import { db, Score } from './db.ts';

// --- Validation ---

/**
 * Validates if the score is within the allowed range (1-45).
 */
export const validateScore = (value: number): boolean => {
  return value >= 1 && value <= 45;
};

/**
 * Validates if the date string is a valid ISO date.
 */
export const validateDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

// --- Business Logic ---

/**
 * Adds a new score for a user.
 * Implements rolling logic: max 5 scores per user.
 */
export const addScore = (userId: string, score: number, date: string): Score | null => {
  if (!validateScore(score)) return null;
  if (!validateDate(date)) return null;

  return db.addScore(userId, score, date);
};

/**
 * Retrieves all scores for a user, sorted newest first.
 */
export const getScores = (userId: string): Score[] => {
  return db.getUserScores(userId);
};

/**
 * Updates an existing score.
 */
export const updateScore = (scoreId: string, newScore: number, newDate: string): Score | null => {
  if (!validateScore(newScore)) return null;
  if (!validateDate(newDate)) return null;

  const existing = db.getScoreById(scoreId);
  if (!existing) return null;

  return db.updateScore(scoreId, { score: newScore, date: newDate }) || null;
};

/**
 * Deletes a score.
 */
export const deleteScore = (scoreId: string): boolean => {
  const existing = db.getScoreById(scoreId);
  if (!existing) return false;

  db.deleteScore(scoreId);
  return true;
};

/**
 * Sorts scores in reverse chronological order.
 * (The DB helper already does this, but we provide it for completeness).
 */
export const sortScores = (scores: Score[]): Score[] => {
  return [...scores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
