import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { db } from './server/db.ts';
import { authenticate, authorizeAdmin, generateToken, removeToken, AuthRequest } from './server/auth.ts';
import { 
  subscribeUser, 
  cancelSubscription, 
  getSubscriptionStatus, 
  requireActiveSubscription 
} from './server/subscription.ts';
import { 
  createDraw, 
  getDrawHistory, 
  matchDraw 
} from './server/draw.ts';
import { 
  addCharity, 
  assignCharityToUser 
} from './server/charity.ts';
import { 
  getAllWinners, 
  getWinnersByDraw, 
  approveWinner, 
  rejectWinner, 
  processPayout, 
  uploadWinnerProof 
} from './server/winner.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // --- Admin API Routes ---

  // User Management
  app.get('/api/admin/users', authenticate, authorizeAdmin, (req, res) => {
    const users = db.getUsers().map(u => db.getUserFullProfile(u.id));
    res.json({ success: true, users });
  });

  app.post('/api/admin/users/:userId/toggle-block', authenticate, authorizeAdmin, (req, res) => {
    const { userId } = req.params;
    const user = db.getUserById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Mock blocking logic: we'll just add a 'blocked' property to the user
    const updated = db.updateUser(userId, { ...user, name: user.name.includes('(BLOCKED)') ? user.name.replace(' (BLOCKED)', '') : `${user.name} (BLOCKED)` });
    res.json({ success: true, user: updated });
  });

  // Subscription Control
  app.get('/api/admin/subscriptions', authenticate, authorizeAdmin, (req, res) => {
    const subs = db.getSubscriptions();
    res.json({ success: true, subscriptions: subs });
  });

  app.post('/api/admin/subscriptions/:subId/expire', authenticate, authorizeAdmin, (req, res) => {
    const { subId } = req.params;
    const updated = db.updateSubscription(subId, { status: 'expired' });
    if (!updated) return res.status(404).json({ success: false, message: 'Subscription not found' });
    res.json({ success: true, subscription: updated });
  });

  app.post('/api/admin/subscriptions/:subId/renew', authenticate, authorizeAdmin, (req, res) => {
    const { subId } = req.params;
    const sub = db.getSubscriptions().find(s => s.id === subId);
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (sub.planType === 'monthly' ? 30 : 365));
    
    const updated = db.updateSubscription(subId, { 
      status: 'active', 
      expiryDate: expiryDate.toISOString(),
      startDate: new Date().toISOString()
    });
    res.json({ success: true, subscription: updated });
  });

  // Charity Management Extensions
  app.put('/api/admin/charity/:id', authenticate, authorizeAdmin, (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = db.updateCharity(id, { name, description });
    if (!updated) return res.status(404).json({ success: false, message: 'Charity not found' });
    res.json({ success: true, charity: updated });
  });

  app.delete('/api/admin/charity/:id', authenticate, authorizeAdmin, (req, res) => {
    const { id } = req.params;
    db.deleteCharity(id);
    res.json({ success: true, message: 'Charity deleted' });
  });

  // Analytics & Prize Pool
  app.get('/api/admin/analytics', authenticate, authorizeAdmin, (req, res) => {
    const users = db.getUsers();
    const subs = db.getSubscriptions();
    const draws = db.getDraws();
    const winners = db.getWinners();
    const charities = db.getCharities();

    const stats = {
      totalUsers: users.length,
      activeSubscriptions: subs.filter(s => s.status === 'active' && new Date(s.expiryDate) > new Date()).length,
      totalPrizePool: winners.reduce((sum, w) => sum + w.prizeAmount, 0) + db.getConfig().jackpotPool,
      totalCharityDonations: charities.reduce((sum, c) => sum + c.totalReceivedAmount, 0),
      drawsConducted: draws.length,
      jackpotRollover: db.getConfig().jackpotPool
    };

    res.json({ success: true, stats });
  });

  app.get('/api/admin/transactions', authenticate, authorizeAdmin, (req, res) => {
    // Mock transaction logs
    const logs = db.getSubscriptions().map(s => ({
      id: `TX_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      userId: s.userId,
      amount: s.planType === 'monthly' ? 10 : 100,
      type: 'subscription',
      status: 'completed',
      createdAt: s.startDate
    }));
    res.json({ success: true, transactions: logs });
  });

  app.post('/api/admin/draw/re-run/:drawId', authenticate, authorizeAdmin, (req, res) => {
    const { drawId } = req.params;
    try {
      // Simulation mode: just re-run matching
      const results = matchDraw(drawId);
      res.json({ success: true, results, message: 'Draw re-run successfully (Simulation Mode)' });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  });

  app.post('/api/admin/winner/upload-proof', authenticate, authorizeAdmin, (req, res) => {
    const { winnerId, proofUrl } = req.body;
    try {
      const winner = uploadWinnerProof(winnerId, proofUrl || `https://storage.mock/proofs/${winnerId}.pdf`);
      res.json({ success: true, winner });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.get('/api/admin/prize-pool', authenticate, authorizeAdmin, (req, res) => {
    const config = db.getConfig();
    res.json({ 
      success: true, 
      pool: {
        total: config.jackpotPool,
        distribution: {
          match5: '40%',
          match4: '35%',
          match3: '25%'
        }
      }
    });
  });

  // --- API Routes ---

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.getUserByEmail(email);
    
    if (user && user.passwordHash === password) {
      const token = generateToken(user.id);
      res.json({ 
        success: true, 
        token,
        user: db.getUserFullProfile(user.id) 
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (db.getUserByEmail(email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = db.createUser({ name, email, passwordHash: password, role: 'user' });
    const token = generateToken(newUser.id);
    
    res.json({ 
      success: true, 
      token,
      user: db.getUserFullProfile(newUser.id) 
    });
  });

  // Auth: Logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      removeToken(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Auth: Me (Get current profile)
  app.get('/api/auth/me', authenticate, (req: AuthRequest, res) => {
    if (req.user) {
      res.json({ success: true, user: db.getUserFullProfile(req.user.id) });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });

  // Score Management (Protected & Subscription Required)
  app.get('/api/scores/:userId', authenticate, requireActiveSubscription, (req: AuthRequest, res) => {
    // Ensure user is requesting their own scores or is an admin
    if (req.user?.id !== req.params.userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }
    const scores = db.getUserScores(req.params.userId);
    res.json({ success: true, scores });
  });

  app.post('/api/scores', authenticate, requireActiveSubscription, (req: AuthRequest, res) => {
    const { userId, score, date } = req.body;
    
    // Security check: user can only add scores for themselves
    if (req.user?.id !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Cannot add scores for other users' });
    }

    // Validation
    if (score < 1 || score > 45) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45' });
    }
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date provided' });
    }

    const newScore = db.addScore(userId, score, date);
    res.json({ success: true, score: newScore, scores: db.getUserScores(userId) });
  });

  app.put('/api/scores/:scoreId', authenticate, requireActiveSubscription, (req: AuthRequest, res) => {
    const { score, date } = req.body;
    const { scoreId } = req.params;

    const existing = db.getScoreById(scoreId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Score not found' });
    }

    // Security check: user can only edit their own scores
    if (req.user?.id !== existing.userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    // Validation
    if (score !== undefined && (score < 1 || score > 45)) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45' });
    }
    if (date !== undefined && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date provided' });
    }

    const updated = db.updateScore(scoreId, { score, date });
    res.json({ success: true, score: updated, scores: db.getUserScores(existing.userId) });
  });

  app.delete('/api/scores/:scoreId', authenticate, requireActiveSubscription, (req: AuthRequest, res) => {
    const { scoreId } = req.params;

    const existing = db.getScoreById(scoreId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Score not found' });
    }

    // Security check: user can only delete their own scores
    if (req.user?.id !== existing.userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    db.deleteScore(scoreId);
    res.json({ success: true, message: 'Score deleted successfully', scores: db.getUserScores(existing.userId) });
  });

  // Subscription Management (Protected)
  app.post('/api/subscribe', authenticate, (req: AuthRequest, res) => {
    const { userId, planType } = req.body;

    if (req.user?.id !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Cannot subscribe for other users' });
    }

    if (planType !== 'monthly' && planType !== 'yearly') {
      return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }

    try {
      const result = subscribeUser(userId, planType);
      res.json({ success: true, ...result });
    } catch (err: any) {
      console.error('Subscription error:', err);
      res.status(500).json({ success: false, message: err.message || 'Subscription failed' });
    }
  });

  app.get('/api/subscription-status', authenticate, (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ success: false });
    const status = getSubscriptionStatus(req.user.id);
    res.json({ success: true, ...status });
  });

  app.post('/api/cancel-subscription', authenticate, (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ success: false });
    const updated = cancelSubscription(req.user.id);
    if (updated) {
      res.json({ success: true, message: 'Subscription cancelled successfully' });
    } else {
      res.status(404).json({ success: false, message: 'No active subscription found' });
    }
  });

  app.post('/api/renew-subscription', authenticate, (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ success: false });
    const sub = db.getSubscriptionByUserId(req.user.id);
    if (!sub) return res.status(404).json({ success: false, message: 'No subscription found' });

    const result = subscribeUser(req.user.id, sub.planType);
    res.json({ success: true, ...result });
  });

  // Draw System (Protected & Admin Only)
  app.post('/api/draw/create', authenticate, authorizeAdmin, (req, res) => {
    const { month } = req.body;
    const drawMonth = month || new Date().toISOString().slice(0, 7);
    const draw = createDraw(drawMonth);
    res.json({ success: true, draw });
  });

  app.get('/api/draw/history', authenticate, (req, res) => {
    const draws = getDrawHistory();
    res.json({ success: true, draws });
  });

  app.post('/api/draw/match/:drawId', authenticate, authorizeAdmin, (req, res) => {
    const { drawId } = req.params;
    try {
      const results = matchDraw(drawId);
      res.json({ success: true, results });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  });

  // Admin: Draw Management (Legacy/Simulated - keeping for backward compatibility if needed)
  app.post('/api/admin/draw', authenticate, authorizeAdmin, (req, res) => {
    const { drawMonth, numbers } = req.body;
    const draw = db.createDraw({ 
      drawMonth: drawMonth || new Date().toISOString().slice(0, 7), 
      numbers: numbers || [1, 2, 3, 4, 5], 
      status: 'completed' 
    });
    
    // Use the new matching logic
    const results = matchDraw(draw.id);
    res.json({ success: true, draw, results });
  });

  // Charity Info (Publicly readable)
  app.get('/api/charities', (req, res) => {
    res.json({ success: true, charities: db.getCharities() });
  });

  // Charity Management (Protected)
  app.post('/api/charity/create', authenticate, authorizeAdmin, (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }
    const charity = addCharity(name, description);
    res.json({ success: true, charity });
  });

  // Winners Management (Protected)
  app.get('/api/winners', authenticate, (req, res) => {
    const winners = getAllWinners();
    res.json({ success: true, winners });
  });

  app.get('/api/winners/:drawId', authenticate, (req, res) => {
    const winners = getWinnersByDraw(req.params.drawId);
    res.json({ success: true, winners });
  });

  app.post('/api/winner/approve', authenticate, authorizeAdmin, (req, res) => {
    try {
      const { winnerId } = req.body;
      const winner = approveWinner(winnerId);
      res.json({ success: true, winner });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.post('/api/winner/reject', authenticate, authorizeAdmin, (req, res) => {
    try {
      const { winnerId } = req.body;
      const winner = rejectWinner(winnerId);
      res.json({ success: true, winner });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.post('/api/winner/pay', authenticate, authorizeAdmin, (req, res) => {
    try {
      const { winnerId } = req.body;
      const winner = processPayout(winnerId);
      res.json({ success: true, winner });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.post('/api/winner/upload-proof', authenticate, authorizeAdmin, (req, res) => {
    try {
      const { winnerId, proofUrl } = req.body;
      const winner = uploadWinnerProof(winnerId, proofUrl);
      res.json({ success: true, winner });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.post('/api/charity/select', authenticate, (req: AuthRequest, res) => {
    const { charityId } = req.body;
    if (!charityId) {
      return res.status(400).json({ success: false, message: 'Charity ID is required' });
    }
    try {
      const user = assignCharityToUser(req.user!.id, charityId);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.put('/api/charity/update', authenticate, (req: AuthRequest, res) => {
    const { charityId } = req.body;
    if (!charityId) {
      return res.status(400).json({ success: false, message: 'Charity ID is required' });
    }
    try {
      const user = assignCharityToUser(req.user!.id, charityId);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.get('/api/charity/impact', authenticate, (req, res) => {
    const charities = db.getCharities();
    const impact = charities.map(c => ({
      ...c,
      contributingUsers: db.getUsers().filter(u => u.selectedCharityId === c.id).length
    }));
    res.json({ success: true, impact });
  });

  // Config Info (Publicly readable)
  app.get('/api/config/public', (req, res) => {
    const config = db.getConfig();
    res.json({ success: true, config: { jackpotPool: config.jackpotPool } });
  });

  // Config Info (Protected)
  app.get('/api/config', authenticate, (req, res) => {
    res.json({ success: true, config: db.getConfig() });
  });

  // --- Vite Middleware ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
