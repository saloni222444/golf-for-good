import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History } from 'lucide-react';
import AdminLayout from './AdminLayout.tsx';
import AnalyticsCards from './AnalyticsCards.tsx';
import UserTable from './UserTable.tsx';
import SubscriptionTable from './SubscriptionTable.tsx';
import TransactionLogs from './TransactionLogs.tsx';
import DrawManager from './DrawManager.tsx';
import WinnerManager from './WinnerManager.tsx';
import CharityManager from './CharityManager.tsx';

interface AdminDashboardProps {
  adminTab: string;
  setAdminTab: (tab: string) => void;
  adminAnalytics: any;
  adminPrizePool: any;
  adminUsers: any[];
  adminSubscriptions: any[];
  adminTransactions: any[];
  adminDraws: any[];
  adminWinners: any[];
  adminCharities: any[];
  handleToggleBlock: (userId: string) => Promise<void>;
  handleExpireSubscription: (subId: string) => Promise<void>;
  handleRenewSubscriptionAdmin: (subId: string) => Promise<void>;
  handleCreateDrawAdmin: () => Promise<void>;
  handleRunDrawAdmin: (drawId: string) => Promise<void>;
  handleAddCharityAdmin: (charityData: any) => Promise<void>;
  handleEditCharityAdmin: (id: string, updates: any) => Promise<void>;
  handleDeleteCharityAdmin: (id: string) => Promise<void>;
  handleApproveWinner: (winnerId: string) => Promise<void>;
  handleRejectWinner: (winnerId: string) => Promise<void>;
  handlePayWinner: (winnerId: string) => Promise<void>;
  handleUploadProofAdmin: (winnerId: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  onSwitchView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminTab,
  setAdminTab,
  adminAnalytics,
  adminPrizePool,
  adminUsers,
  adminSubscriptions,
  adminTransactions,
  adminDraws,
  adminWinners,
  adminCharities,
  handleToggleBlock,
  handleExpireSubscription,
  handleRenewSubscriptionAdmin,
  handleCreateDrawAdmin,
  handleRunDrawAdmin,
  handleAddCharityAdmin,
  handleEditCharityAdmin,
  handleDeleteCharityAdmin,
  handleApproveWinner,
  handleRejectWinner,
  handlePayWinner,
  handleUploadProofAdmin,
  handleLogout,
  onSwitchView
}) => {
  return (
    <AdminLayout 
      activeTab={adminTab} 
      setActiveTab={setAdminTab} 
      onLogout={handleLogout}
      onSwitchView={onSwitchView}
    >
      <AnimatePresence mode="wait">
        {adminTab === 'analytics' && adminAnalytics && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AnalyticsCards stats={adminAnalytics} />
            
            {adminPrizePool && (
              <div className="mt-8 glass-dark p-8 rounded-[2rem] border-white/5">
                <h3 className="text-xl font-bold mb-6 font-display tracking-tight">Prize Distribution Monitor</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(adminPrizePool.distribution).map(([match, percent]) => (
                    <div key={match} className="p-4 bg-black/40 rounded-2xl border border-white/5">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                        {match === 'match5' ? '5 Matches' : match === 'match4' ? '4 Matches' : '3 Matches'}
                      </p>
                      <p className="text-2xl font-bold text-emerald-400">{percent as string}</p>
                      <p className="text-[10px] text-zinc-600 mt-1">of current pool</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {adminTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <UserTable users={adminUsers} onToggleBlock={handleToggleBlock} />
          </motion.div>
        )}

        {adminTab === 'subscriptions' && (
          <motion.div
            key="subscriptions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <SubscriptionTable 
              subscriptions={adminSubscriptions} 
              onExpire={handleExpireSubscription}
              onRenew={handleRenewSubscriptionAdmin}
            />

            <div className="glass-dark p-8 rounded-[2rem] border-white/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-display tracking-tight">
                <History className="text-emerald-400" size={24} />
                Recent Transaction Logs
              </h3>
              <TransactionLogs transactions={adminTransactions} />
            </div>
          </motion.div>
        )}

        {adminTab === 'draws' && (
          <motion.div
            key="draws"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DrawManager 
              draws={adminDraws} 
              onCreateDraw={handleCreateDrawAdmin}
              onRunDraw={handleRunDrawAdmin}
            />
          </motion.div>
        )}

        {adminTab === 'winners' && (
          <motion.div
            key="winners"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <WinnerManager 
              winners={adminWinners}
              onApprove={handleApproveWinner}
              onReject={handleRejectWinner}
              onPay={handlePayWinner}
              onUploadProof={handleUploadProofAdmin}
            />
          </motion.div>
        )}

        {adminTab === 'charities' && (
          <motion.div
            key="charities"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CharityManager 
              charities={adminCharities}
              onAdd={handleAddCharityAdmin}
              onEdit={handleEditCharityAdmin}
              onDelete={handleDeleteCharityAdmin}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};
