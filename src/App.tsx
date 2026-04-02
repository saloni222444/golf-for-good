import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Calendar, 
  CreditCard, 
  Heart, 
  ChevronRight,
  TrendingUp,
  Award,
  ShieldCheck,
  History
} from 'lucide-react';
import { UserProfile, Score, Subscription } from './types.ts';
import { UserDashboard } from './components/dashboard/UserDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { SignupFlow } from './components/SignupFlow.tsx';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('golf_auth_token'));
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'admin'>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [drawHistory, setDrawHistory] = useState<any[]>([]);
  const [jackpotPool, setJackpotPool] = useState<number>(0);
  const [charities, setCharities] = useState<any[]>([]);
  const [charityImpact, setCharityImpact] = useState<any[]>([]);
  const [allWinners, setAllWinners] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Admin State
  const [adminTab, setAdminTab] = useState('analytics');
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminSubscriptions, setAdminSubscriptions] = useState<any[]>([]);
  const [adminDraws, setAdminDraws] = useState<any[]>([]);
  const [adminWinners, setAdminWinners] = useState<any[]>([]);
  const [adminCharities, setAdminCharities] = useState<any[]>([]);
  const [adminTransactions, setAdminTransactions] = useState<any[]>([]);
  const [adminAnalytics, setAdminAnalytics] = useState<any | null>(null);
  const [adminPrizePool, setAdminPrizePool] = useState<any | null>(null);

  const fetchProfile = async (overrideToken?: string) => {
    const activeToken = overrideToken || token;
    if (!activeToken) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return data.user;
      }
      return null;
    } catch (err) {
      console.error('Fetch profile failed', err);
      return null;
    }
  };

  // --- Initial Auth Check ---
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('golf_auth_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchProfile(savedToken);
        if (userData) {
          setToken(savedToken);
          setView(userData.role === 'admin' ? 'admin' : 'dashboard');
        } else {
          localStorage.removeItem('golf_auth_token');
          setToken(null);
          setView('landing');
        }
      } catch (err) {
        console.error('Auth check failed', err);
        localStorage.removeItem('golf_auth_token');
        setToken(null);
        setView('landing');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Only run once on mount

  // --- Public Data Fetching ---
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const charitiesRes = await fetch('/api/charities');
        const charitiesData = await charitiesRes.json();
        if (charitiesData.success) {
          setCharities(charitiesData.charities);
        }

        const configRes = await fetch('/api/config/public');
        const configData = await configRes.json();
        if (configData.success) {
          setJackpotPool(configData.config.jackpotPool);
        }
      } catch (err) {
        console.error('Failed to fetch public data', err);
      }
    };

    fetchPublicData();
  }, []);

  useEffect(() => {
    const fetchDrawHistory = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/draw/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setDrawHistory(data.draws);
        }

        const impactRes = await fetch('/api/charity/impact', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const impactData = await impactRes.json();
        if (impactData.success) {
          setCharityImpact(impactData.impact);
        }

        const winnersRes = await fetch('/api/winners', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const winnersData = await winnersRes.json();
        if (winnersData.success) {
          setAllWinners(winnersData.winners);
        }
      } catch (err) {
        console.error('Failed to fetch draw history or config', err);
      }
    };

    if (token) {
      fetchDrawHistory();
    }
  }, [token, view]);

  // --- Admin Data Fetching ---
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token || view !== 'admin') return;

      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [usersRes, subsRes, drawsRes, winnersRes, charitiesRes, analyticsRes, poolRes, txRes] = await Promise.all([
          fetch('/api/admin/users', { headers }),
          fetch('/api/admin/subscriptions', { headers }),
          fetch('/api/draw/history', { headers }),
          fetch('/api/winners', { headers }),
          fetch('/api/charities', { headers }),
          fetch('/api/admin/analytics', { headers }),
          fetch('/api/admin/prize-pool', { headers }),
          fetch('/api/admin/transactions', { headers })
        ]);

        const [usersData, subsData, drawsData, winnersData, charitiesData, analyticsData, poolData, txData] = await Promise.all([
          usersRes.json(),
          subsRes.json(),
          drawsRes.json(),
          winnersRes.json(),
          charitiesRes.json(),
          analyticsRes.json(),
          poolRes.json(),
          txRes.json()
        ]);

        if (usersData.success) setAdminUsers(usersData.users);
        if (subsData.success) setAdminSubscriptions(subsData.subscriptions);
        if (drawsData.success) setAdminDraws(drawsData.draws);
        if (winnersData.success) setAdminWinners(winnersData.winners);
        if (charitiesData.success) setAdminCharities(charitiesData.charities);
        if (analyticsData.success) setAdminAnalytics(analyticsData.stats);
        if (poolData.success) setAdminPrizePool(poolData.pool);
        if (txData.success) setAdminTransactions(txData.transactions);

      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };

    fetchAdminData();
  }, [token, view, adminTab]);

  // --- Auth Actions ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('golf_auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setView(data.user.role === 'admin' ? 'admin' : 'dashboard');
        setMessage(null);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setView('signup');
  };

  const handleSignupComplete = async (formData: any) => {
    setLoading(true);
    setMessage(null);
    try {
      console.log('Starting signup flow for:', formData.email);
      // 1. Register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: `${formData.firstName} ${formData.lastName}`.trim(), 
          email: formData.email, 
          password: formData.password 
        }),
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      
      const newToken = data.token;
      const userId = data.user.id;
      console.log('Registration successful, userId:', userId);
      
      // 2. Subscribe
      const subRes = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        body: JSON.stringify({ userId, planType: formData.plan }),
      });
      const subData = await subRes.json();
      if (!subRes.ok || !subData.success) {
        throw new Error(subData.message || 'Subscription failed');
      }
      console.log('Subscription successful');
      
      // 3. Select Charity
      const charRes = await fetch('/api/charity/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        body: JSON.stringify({ charityId: formData.charityId })
      });
      const charData = await charRes.json();
      if (!charRes.ok || !charData.success) {
        throw new Error(charData.message || 'Charity selection failed');
      }
      console.log('Charity selection successful');

      // Final profile fetch to get fully populated state
      const profileRes = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${newToken}` }
      });
      const profileData = await profileRes.json();
      
      if (profileData.success) {
        console.log('App: Signup flow complete, redirecting to dashboard');
        // SUCCESS! Now update state
        localStorage.setItem('golf_auth_token', newToken);
        
        // Update all relevant state at once
        setUser(profileData.user);
        setToken(newToken);
        setView('dashboard');
        
        setMessage({ type: 'success', text: 'Welcome to Golf For Good! Your registration is complete.' });
      } else {
        throw new Error('Failed to fetch profile after registration');
      }
    } catch (err: any) {
      console.error('Signup flow error:', err);
      setMessage({ type: 'error', text: err.message || 'Registration failed. Please try again.' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('golf_auth_token');
      setToken(null);
      setUser(null);
      setView('landing');
    }
  };

  const handleSelectCharity = async (charityId: string) => {
    console.log('Selecting charity:', charityId);
    try {
      const res = await fetch('/api/charity/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ charityId })
      });
      const data = await res.json();
      console.log('Charity selection response:', data);
      if (data.success && data.user) {
        setUser(data.user);
        setMessage({ type: 'success', text: 'Charity preference updated!' });
      } else {
        console.error('Charity selection failed:', data.message);
        setMessage({ type: 'error', text: data.message || 'Failed to update charity' });
      }
    } catch (err) {
      console.error('Charity selection error:', err);
      setMessage({ type: 'error', text: 'Failed to update charity' });
    }
  };

  const handleCreateCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
      const res = await fetch('/api/charity/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });
      const data = await res.json();
      if (data.success) {
        setCharities([...charities, data.charity]);
        setMessage({ type: 'success', text: 'Charity added successfully!' });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add charity' });
    }
  };

  const handleApproveWinner = async (winnerId: string) => {
    try {
      const res = await fetch('/api/winner/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ winnerId })
      });
      const data = await res.json();
      if (data.success) {
        setAllWinners(allWinners.map(w => w.id === winnerId ? data.winner : w));
        setMessage({ type: 'success', text: 'Winner approved!' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to approve winner' });
    }
  };

  const handleRejectWinner = async (winnerId: string) => {
    try {
      const res = await fetch('/api/winner/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ winnerId })
      });
      const data = await res.json();
      if (data.success) {
        setAllWinners(allWinners.map(w => w.id === winnerId ? data.winner : w));
        setMessage({ type: 'success', text: 'Winner rejected' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reject winner' });
    }
  };

  const handlePayWinner = async (winnerId: string) => {
    try {
      const res = await fetch('/api/winner/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ winnerId })
      });
      const data = await res.json();
      if (data.success) {
        setAllWinners(allWinners.map(w => w.id === winnerId ? data.winner : w));
        setAdminWinners(adminWinners.map(w => w.id === winnerId ? data.winner : w));
        setMessage({ type: 'success', text: 'Payout processed successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to process payout' });
    }
  };

  // --- Admin Actions ---

  const handleToggleBlock = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-block`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers(adminUsers.map(u => u.id === userId ? data.user : u));
        setMessage({ type: 'success', text: 'User status updated' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to toggle user block' });
    }
  };

  const handleExpireSubscription = async (subId: string) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${subId}/expire`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminSubscriptions(adminSubscriptions.map(s => s.id === subId ? data.subscription : s));
        setMessage({ type: 'success', text: 'Subscription expired' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to expire subscription' });
    }
  };

  const handleRenewSubscriptionAdmin = async (subId: string) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${subId}/renew`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminSubscriptions(adminSubscriptions.map(s => s.id === subId ? data.subscription : s));
        setMessage({ type: 'success', text: 'Subscription renewed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to renew subscription' });
    }
  };

  const handleCreateDrawAdmin = async () => {
    try {
      const res = await fetch('/api/draw/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ month: new Date().toISOString().slice(0, 7) })
      });
      const data = await res.json();
      if (data.success) {
        setAdminDraws([data.draw, ...adminDraws]);
        setMessage({ type: 'success', text: 'New draw created' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create draw' });
    }
  };

  const handleRunDrawAdmin = async (drawId: string) => {
    try {
      const draw = adminDraws.find(d => d.id === drawId);
      const isReRun = draw && draw.status === 'completed';
      const endpoint = isReRun ? `/api/admin/draw/re-run/${drawId}` : `/api/draw/match/${drawId}`;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: isReRun ? 'Draw re-run simulation successful!' : 'Draw executed successfully!' });
        // Refresh draws and winners
        const drawsRes = await fetch('/api/draw/history', { headers: { 'Authorization': `Bearer ${token}` } });
        const winnersRes = await fetch('/api/winners', { headers: { 'Authorization': `Bearer ${token}` } });
        const dData = await drawsRes.json();
        const wData = await winnersRes.json();
        if (dData.success) setAdminDraws(dData.draws);
        if (wData.success) setAdminWinners(wData.winners);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to execute draw' });
    }
  };

  const handleAddCharityAdmin = async (charityData: any) => {
    try {
      const res = await fetch('/api/charity/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(charityData)
      });
      const data = await res.json();
      if (data.success) {
        setAdminCharities([...adminCharities, data.charity]);
        setMessage({ type: 'success', text: 'Charity added' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add charity' });
    }
  };

  const handleEditCharityAdmin = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/charity/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setAdminCharities(adminCharities.map(c => c.id === id ? data.charity : c));
        setMessage({ type: 'success', text: 'Charity updated' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update charity' });
    }
  };

  const handleDeleteCharityAdmin = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/charity/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminCharities(adminCharities.filter(c => c.id !== id));
        setMessage({ type: 'success', text: 'Charity deleted' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete charity' });
    }
  };

  const handleUploadProofAdmin = async (winnerId: string) => {
    try {
      const res = await fetch('/api/admin/winner/upload-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ winnerId, proofUrl: `/proofs/txn_${winnerId}.pdf` })
      });
      const data = await res.json();
      if (data.success) {
        setAdminWinners(adminWinners.map(w => w.id === winnerId ? data.winner : w));
        setMessage({ type: 'success', text: 'Proof uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload proof' });
    }
  };

  // --- Protected Actions ---

  const addScore = async (score: number, date: string) => {
    if (!user || !token) return;
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id, score, date }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, scores: data.scores });
        setMessage({ type: 'success', text: 'Score added successfully!' });
      } else {
        if (data.code === 'SUBSCRIPTION_REQUIRED') {
          setMessage({ type: 'error', text: 'Active subscription required to track scores.' });
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add score' });
    }
  };

  const handleUpdateScore = async (scoreId: string, score: number, date: string) => {
    if (!token || !user) return;
    try {
      const res = await fetch(`/api/scores/${scoreId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score, date }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, scores: data.scores });
        setEditingScoreId(null);
        setMessage({ type: 'success', text: 'Score updated!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update score' });
    }
  };

  const handleDeleteScore = async (scoreId: string) => {
    if (!token || !user) return;
    try {
      const res = await fetch(`/api/scores/${scoreId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, scores: data.scores });
        setMessage({ type: 'success', text: 'Score deleted.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete score' });
    }
  };

  const subscribe = async (plan: 'monthly' | 'yearly') => {
    if (!user || !token) return;
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id, planType: plan }),
      });
      const data = await res.json();
      if (data.success) {
        const profileRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        setUser(profileData.user);
        setMessage({ type: 'success', text: `Subscribed to ${plan} plan!` });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Subscription failed' });
    }
  };

  const handleCancelSubscription = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const profileRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        setUser(profileData.user);
        setMessage({ type: 'success', text: 'Subscription cancelled.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to cancel subscription' });
    }
  };

  const handleRenewSubscription = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/renew-subscription', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const profileRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        setUser(profileData.user);
        setMessage({ type: 'success', text: 'Subscription renewed!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to renew subscription' });
    }
  };

  const runDraw = async () => {
    if (!token) return;
    try {
      // 1. Create the draw
      const res = await fetch('/api/draw/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          month: new Date().toISOString().slice(0, 7)
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        // 2. Match users against the new draw
        const matchRes = await fetch(`/api/draw/match/${data.draw.id}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const matchData = await matchRes.json();

        if (matchData.success) {
          const results = matchData.results;
          setMessage({ 
            type: 'success', 
            text: `Draw completed! Pool: £${results.totalPool}. Rollover: £${results.newRollover}.` 
          });
          // Refresh history and config
          const historyRes = await fetch('/api/draw/history', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const historyData = await historyRes.json();
          if (historyData.success) setDrawHistory(historyData.draws);

          const configRes = await fetch('/api/config', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const configData = await configRes.json();
          if (configData.success) setJackpotPool(configData.config.jackpotPool);
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Draw process failed' });
    }
  };

  // --- UI Components ---

  const renderContent = () => {
    if (loading && view !== 'signup' && view !== 'dashboard') {
      return (
        <div key="global-loader" className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-emerald-500/10 blur-[160px] rounded-full animate-pulse" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-bounce">
              <span className="text-black font-black text-3xl">G</span>
            </div>
            <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="h-full w-full bg-emerald-500"
              />
            </div>
          </motion.div>
        </div>
      );
    }

    switch (view) {
      case 'landing':
        return (
          <LandingPage 
            key="landing"
            onLogin={() => setView('login')} 
            onSignup={() => setView('signup')} 
            jackpotPool={jackpotPool}
          />
        );
      case 'signup':
        return (
          <SignupFlow 
            key="signup"
            onComplete={handleSignupComplete}
            onCancel={() => setView('landing')}
            loading={loading}
            charities={charities}
          />
        );
      case 'login':
        return (
          <div key="login" className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden bg-mesh">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark w-full max-w-md p-10 rounded-[2.5rem] space-y-8 relative z-10 border-white/10"
            >
              <div className="text-center space-y-4">
                <button 
                  onClick={() => setView('landing')}
                  className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 mb-6">
                  <span className="text-black font-black text-3xl">G</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight font-display">Welcome Back</h2>
                <p className="text-zinc-500 text-sm">Sign in to manage your golf charity contributions.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-display"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-display"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-2xl text-xs font-bold border ${
                        message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}
                    >
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-500 text-black font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 font-display text-base"
                  >
                    {loading ? '...' : 'Login'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                    className="flex-1 bg-white/10 text-white font-black py-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10 disabled:opacity-50 font-display text-base"
                  >
                    {loading ? '...' : 'Signup'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        );
      case 'dashboard':
        return user ? (
          <UserDashboard 
            key="user-dashboard"
            user={user}
            jackpotPool={jackpotPool}
            drawHistory={drawHistory}
            charities={charities}
            fetchProfile={fetchProfile}
            addScore={addScore}
            handleDeleteScore={handleDeleteScore}
            subscribe={subscribe}
            handleRenewSubscription={handleRenewSubscription}
            handleCancelSubscription={handleCancelSubscription}
            handleSelectCharity={handleSelectCharity}
            handleLogout={handleLogout}
            onSwitchToAdmin={() => setView('admin')}
          />
        ) : (
          <div key="dashboard-loader" className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        );
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminDashboard 
            key="admin-dashboard"
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            adminAnalytics={adminAnalytics}
            adminPrizePool={adminPrizePool}
            adminUsers={adminUsers}
            adminSubscriptions={adminSubscriptions}
            adminTransactions={adminTransactions}
            adminDraws={adminDraws}
            adminWinners={adminWinners}
            adminCharities={adminCharities}
            handleToggleBlock={handleToggleBlock}
            handleExpireSubscription={handleExpireSubscription}
            handleRenewSubscriptionAdmin={handleRenewSubscriptionAdmin}
            handleCreateDrawAdmin={handleCreateDrawAdmin}
            handleRunDrawAdmin={handleRunDrawAdmin}
            handleAddCharityAdmin={handleAddCharityAdmin}
            handleEditCharityAdmin={handleEditCharityAdmin}
            handleDeleteCharityAdmin={handleDeleteCharityAdmin}
            handleApproveWinner={handleApproveWinner}
            handleRejectWinner={handleRejectWinner}
            handlePayWinner={handlePayWinner}
            handleUploadProofAdmin={handleUploadProofAdmin}
            handleLogout={handleLogout}
            onSwitchView={() => setView('dashboard')}
          />
        ) : (
          <div key="admin-denied" className="min-h-screen flex items-center justify-center">
            <p className="text-zinc-500">Access Denied</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className={`px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-red-500 border-red-400 text-white'}`}>
              <span className="font-bold">{message.text}</span>
              <button onClick={() => setMessage(null)} className="opacity-50 hover:opacity-100">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
