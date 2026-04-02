export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: 'monthly' | 'yearly';
  status: 'active' | 'expired';
  startDate: string;
  expiryDate: string;
  transactionId: string;
}

export interface Score {
  id: string;
  userId: string;
  score: number;
  date: string;
}

export interface Winner {
  id: string;
  userId: string;
  drawId: string;
  matchCount: number;
  prizeCategory: string;
  prizeAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  proofUrl?: string;
  createdAt: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  totalReceivedAmount: number;
  userCount: number;
}

export interface Draw {
  id: string;
  drawDate: string;
  winningNumbers: number[];
  status: 'pending' | 'completed';
  totalPrizePool: number;
}

export interface UserProfile extends User {
  subscription?: Subscription;
  scores: Score[];
  winners: Winner[];
}
