import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Heart, Award } from 'lucide-react';
import { UserProfile } from '../../types.ts';
import { DashboardLayout } from './DashboardLayout.tsx';
import { ScoreManager } from './ScoreManager.tsx';
import { DrawResults } from './DrawResults.tsx';
import { WinningsTable } from './WinningsTable.tsx';
import { SubscriptionCard } from './SubscriptionCard.tsx';
import { CharitySelector } from './CharitySelector.tsx';

interface UserDashboardProps {
  user: UserProfile;
  jackpotPool: number;
  drawHistory: any[];
  charities: any[];
  fetchProfile: () => Promise<any>;
  addScore: (score: number, date: string) => Promise<void>;
  handleDeleteScore: (scoreId: string) => Promise<void>;
  subscribe: (plan: 'monthly' | 'yearly') => Promise<void>;
  handleRenewSubscription: () => Promise<void>;
  handleCancelSubscription: () => Promise<void>;
  handleSelectCharity: (charityId: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  onSwitchToAdmin: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  jackpotPool,
  drawHistory,
  charities,
  fetchProfile,
  addScore,
  handleDeleteScore,
  subscribe,
  handleRenewSubscription,
  handleCancelSubscription,
  handleSelectCharity,
  handleLogout,
  onSwitchToAdmin
}) => {
  return (
    <DashboardLayout 
      user={user} 
      onLogout={handleLogout}
      onSwitchToAdmin={onSwitchToAdmin}
      jackpotPool={jackpotPool}
    >
      <div className="space-y-12">
        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="glass-dark p-8 rounded-[2rem] space-y-4 relative overflow-hidden group border-white/5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700" />
            <div className="flex items-center justify-between relative z-10">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-display">Handicap</span>
            </div>
            <div className="text-6xl font-black relative z-10 tracking-tighter font-display text-glow">
              {user?.scores.length ? (user.scores.reduce((a, b) => a + b.score, 0) / user.scores.length).toFixed(1) : '--'}
            </div>
            <p className="text-xs text-zinc-500 relative z-10 font-medium">Average of last 5 rounds</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-dark p-8 rounded-[2rem] space-y-4 relative overflow-hidden group border-white/5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-pink-500/20 transition-all duration-700" />
            <div className="flex items-center justify-between relative z-10">
              <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-display">Impact</span>
            </div>
            <div className="text-6xl font-black relative z-10 tracking-tighter font-display text-glow-pink">
              £{user?.subscription ? (user.subscription.planType === 'monthly' ? 5 : 50).toFixed(0) : '0'}
            </div>
            <p className="text-xs text-zinc-500 relative z-10 font-medium">Total charity contribution</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="glass-dark p-8 rounded-[2rem] space-y-4 relative overflow-hidden group border-white/5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-all duration-700" />
            <div className="flex items-center justify-between relative z-10">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-display">Wins</span>
            </div>
            <div className="text-6xl font-black relative z-10 tracking-tighter font-display text-glow-amber">
              {user?.winners.length || 0}
            </div>
            <p className="text-xs text-zinc-500 relative z-10 font-medium">Monthly draw rewards</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ScoreManager 
              scores={user?.scores || []}
              onAddScore={(score) => {
                const date = new Date().toISOString().split('T')[0];
                addScore(score, date);
              }}
              onDeleteScore={handleDeleteScore}
              disabled={user?.subscription?.status !== 'active'}
            />
            
            <DrawResults 
              latestDraw={drawHistory[0]}
              userMatchResult={user?.winners.find(w => w.drawId === drawHistory[0]?.id)}
            />

            <WinningsTable 
              winners={user?.winners || []} 
              onRefresh={fetchProfile}
            />
          </div>

          <div className="space-y-8">
            <SubscriptionCard 
              subscription={user?.subscription}
              onSubscribe={subscribe}
              onRenew={handleRenewSubscription}
              onCancel={handleCancelSubscription}
            />
          </div>
        </div>

        {/* Charity Section */}
        <CharitySelector 
          charities={charities}
          selectedCharityId={user?.selectedCharityId}
          onSelectCharity={handleSelectCharity}
        />
      </div>
    </DashboardLayout>
  );
};
