import fs from 'fs';
import path from 'path';

// --- Types ---

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  selectedCharityId?: string;
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
  score: number; // 1-45
  date: string;
}

export interface Draw {
  id: string;
  drawMonth: string; // e.g., "2026-03"
  numbers: number[]; // array of 5 numbers
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface Winner {
  id: string;
  userId: string;
  drawId: string;
  matchCount: number;
  prizeCategory: 'JACKPOT' | 'HIGH' | 'MEDIUM' | 'NONE';
  prizeAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentReference?: string;
  proofUrl?: string;
  createdAt: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  totalReceivedAmount: number;
  createdAt: string;
}

export interface Config {
  jackpotPool: number;
}

interface DatabaseSchema {
  users: User[];
  subscriptions: Subscription[];
  scores: Score[];
  draws: Draw[];
  winners: Winner[];
  charities: Charity[];
  config: Config;
}

// --- DB Utility ---

const DB_FILE = path.join(process.cwd(), 'db.json');

const initialData: DatabaseSchema = {
  users: [
    {
      id: 'admin-1',
      name: 'System Admin',
      email: 'admin@golfcharity.com',
      passwordHash: 'admin123', // In a real app, use bcrypt
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
  ],
  subscriptions: [],
  scores: [],
  draws: [],
  winners: [],
  charities: [
    {
      id: 'charity-1',
      name: 'Junior Golf Foundation',
      description: 'Supporting young golfers from underprivileged backgrounds.',
      totalReceivedAmount: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'charity-2',
      name: 'Green Fairways',
      description: 'Environmental conservation on golf courses.',
      totalReceivedAmount: 0,
      createdAt: new Date().toISOString(),
    }
  ],
  config: {
    jackpotPool: 0,
  },
};

class MockDB {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        console.error('Error loading DB, resetting to initial data', e);
        return initialData;
      }
    }
    this.save(initialData);
    return initialData;
  }

  private save(data: DatabaseSchema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    this.data = data;
  }

  // --- CRUD Helpers ---

  private getTable<T extends keyof DatabaseSchema>(table: T): DatabaseSchema[T] {
    return this.data[table];
  }

  updateTable<T extends keyof DatabaseSchema>(table: T, newData: DatabaseSchema[T]) {
    const updatedData = { ...this.data, [table]: newData };
    this.save(updatedData);
  }

  // --- User Operations ---
  getUsers() { return this.getTable('users'); }
  getUserById(id: string) { return this.getUsers().find(u => u.id === id); }
  getUserByEmail(email: string) { return this.getUsers().find(u => u.email === email); }
  createUser(user: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.updateTable('users', [...this.getUsers(), newUser]);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>) {
    const users = this.getUsers().map(u => u.id === id ? { ...u, ...updates } : u);
    this.updateTable('users', users);
    return users.find(u => u.id === id);
  }

  // --- Subscription Operations ---
  getSubscriptions() { return this.getTable('subscriptions'); }
  getSubscriptionByUserId(userId: string) {
    return this.getSubscriptions().find(s => s.userId === userId);
  }
  createSubscription(sub: Omit<Subscription, 'id'>) {
    const existing = this.getSubscriptionByUserId(sub.userId);
    if (existing) {
      // If exists, we update it instead of creating a new one to keep it simple
      return this.updateSubscription(existing.id, sub);
    }
    const newSub: Subscription = {
      ...sub,
      id: `sub-${Date.now()}`,
    };
    this.updateTable('subscriptions', [...this.getSubscriptions(), newSub]);
    return newSub;
  }
  updateSubscription(id: string, updates: Partial<Subscription>) {
    const subs = this.getSubscriptions().map(s => s.id === id ? { ...s, ...updates } : s);
    this.updateTable('subscriptions', subs);
    return subs.find(s => s.id === id);
  }
  deleteSubscription(id: string) {
    const subs = this.getSubscriptions().filter(s => s.id !== id);
    this.updateTable('subscriptions', subs);
  }

  // --- Score Operations ---
  getScores() { return this.getTable('scores'); }
  getScoreById(id: string) { return this.getScores().find(s => s.id === id); }
  getUserScores(userId: string) {
    return this.getScores()
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  addScore(userId: string, scoreValue: number, date?: string) {
    const userScores = this.getUserScores(userId);
    const allScores = this.getScores();

    // Rolling logic: if 5 exist, remove oldest (last in sorted list)
    if (userScores.length >= 5) {
      const oldestScoreId = userScores[userScores.length - 1].id;
      const filteredScores = allScores.filter(s => s.id !== oldestScoreId);
      this.updateTable('scores', filteredScores);
    }

    const newScore: Score = {
      id: `score-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      userId,
      score: scoreValue,
      date: date || new Date().toISOString(),
    };

    this.updateTable('scores', [...this.getScores(), newScore]);
    return newScore;
  }

  updateScore(id: string, updates: Partial<Omit<Score, 'id' | 'userId'>>) {
    const scores = this.getScores().map(s => s.id === id ? { ...s, ...updates } : s);
    this.updateTable('scores', scores);
    return scores.find(s => s.id === id);
  }

  deleteScore(id: string) {
    const scores = this.getScores().filter(s => s.id !== id);
    this.updateTable('scores', scores);
  }

  // --- Draw Operations ---
  getDraws() { return this.getTable('draws'); }
  createDraw(draw: Omit<Draw, 'id' | 'createdAt'>) {
    const newDraw: Draw = {
      ...draw,
      id: `draw-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.updateTable('draws', [...this.getDraws(), newDraw]);
    return newDraw;
  }
  updateDraw(id: string, updates: Partial<Draw>) {
    const draws = this.getDraws().map(d => d.id === id ? { ...d, ...updates } : d);
    this.updateTable('draws', draws);
  }

  // --- Winner Operations ---
  getWinners() { return this.getTable('winners'); }
  createWinner(winner: Omit<Winner, 'id'>) {
    const newWinner: Winner = {
      ...winner,
      id: `winner-${Date.now()}`,
    };
    this.updateTable('winners', [...this.getWinners(), newWinner]);
    return newWinner;
  }

  updateWinner(id: string, updates: Partial<Winner>) {
    const winners = this.getWinners().map(w => w.id === id ? { ...w, ...updates } : w);
    this.updateTable('winners', winners);
    return winners.find(w => w.id === id);
  }

  // --- Charity Operations ---
  getCharities() { return this.getTable('charities'); }
  createCharity(charity: Omit<Charity, 'id' | 'createdAt' | 'totalReceivedAmount'>) {
    const newCharity: Charity = {
      ...charity,
      id: `charity-${Date.now()}`,
      totalReceivedAmount: 0,
      createdAt: new Date().toISOString(),
    };
    this.updateTable('charities', [...this.getCharities(), newCharity]);
    return newCharity;
  }

  updateCharity(id: string, updates: Partial<Charity>) {
    const charities = this.getCharities().map(c => c.id === id ? { ...c, ...updates } : c);
    this.updateTable('charities', charities);
    return charities.find(c => c.id === id);
  }

  deleteCharity(id: string) {
    const charities = this.getCharities().filter(c => c.id !== id);
    this.updateTable('charities', charities);
  }

  // --- Config Operations ---
  getConfig() { return this.data.config; }
  updateConfig(updates: Partial<Config>) {
    const newConfig = { ...this.data.config, ...updates };
    this.data.config = newConfig;
    this.save(this.data);
    return newConfig;
  }

  // --- Logic Functions ---

  checkActiveSubscription(userId: string): boolean {
    const sub = this.getSubscriptionByUserId(userId);
    if (!sub) return false;
    if (sub.status !== 'active') return false;
    return new Date(sub.expiryDate) > new Date();
  }

  getUserFullProfile(userId: string) {
    const user = this.getUserById(userId);
    if (!user) return null;

    return {
      ...user,
      subscription: this.getSubscriptionByUserId(userId),
      scores: this.getUserScores(userId),
      winners: this.getWinners().filter(w => w.userId === userId),
    };
  }
}

export const db = new MockDB();
