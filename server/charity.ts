import { db, Charity } from './db.ts';

/**
 * Adds a new charity to the database (Admin only).
 */
export const addCharity = (name: string, description: string) => {
  return db.createCharity({ name, description });
};

/**
 * Assigns a charity to a user profile.
 */
export const assignCharityToUser = (userId: string, charityId: string) => {
  const user = db.getUserById(userId);
  if (!user) throw new Error('User not found');

  const charity = db.getCharities().find(c => c.id === charityId);
  if (!charity) throw new Error('Charity not found');

  db.updateUser(userId, { selectedCharityId: charityId });
  return db.getUserFullProfile(userId);
};

/**
 * Calculates the charity contribution (minimum 10% of a given amount).
 */
export const calculateCharityContribution = (amount: number): number => {
  return Math.floor(amount * 0.1 * 100) / 100; // 10% rounded to 2 decimal places
};

/**
 * Updates a charity's total received amount.
 */
export const updateCharityFunds = (charityId: string, amount: number) => {
  const charity = db.getCharities().find(c => c.id === charityId);
  if (!charity) return null;

  const newTotal = Math.floor((charity.totalReceivedAmount + amount) * 100) / 100;
  return db.updateCharity(charityId, { totalReceivedAmount: newTotal });
};

/**
 * Distributes a pool of funds among selected charities of active users.
 * If a user has no charity selected, it goes to a random or default charity.
 */
export const distributeCharityPool = (totalAmount: number) => {
  const activeSubs = db.getSubscriptions().filter(s => s.status === 'active');
  const charities = db.getCharities();
  if (charities.length === 0) return;

  // Count how many users have selected each charity
  const charityCounts: Record<string, number> = {};
  let totalUsersWithSelection = 0;

  activeSubs.forEach(sub => {
    const user = db.getUserById(sub.userId);
    if (user?.selectedCharityId) {
      charityCounts[user.selectedCharityId] = (charityCounts[user.selectedCharityId] || 0) + 1;
      totalUsersWithSelection++;
    }
  });

  if (totalUsersWithSelection === 0) {
    // If no one selected anything, give it to the first charity as default
    updateCharityFunds(charities[0].id, totalAmount);
    return;
  }

  // Distribute proportional to user selection
  charities.forEach(charity => {
    const count = charityCounts[charity.id] || 0;
    if (count > 0) {
      const share = (count / totalUsersWithSelection) * totalAmount;
      updateCharityFunds(charity.id, share);
    }
  });
};
