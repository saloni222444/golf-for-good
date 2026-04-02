import React from 'react';
import { motion } from 'motion/react';

import { LogOut, LayoutDashboard, Shield } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    role: string;
  };
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
  jackpotPool?: number;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user, onLogout, onSwitchToAdmin, jackpotPool }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <span className="text-black font-black text-xl">G</span>
              </motion.div>
              <h1 className="text-xl font-bold tracking-tight font-display">GolfCharity</h1>
            </div>

            {jackpotPool !== undefined && (
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Jackpot</span>
                <span className="text-emerald-400 font-bold font-display text-glow">£{jackpotPool.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {user.role === 'admin' && onSwitchToAdmin && (
              <button 
                onClick={onSwitchToAdmin}
                className="hidden sm:flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/20 transition-all"
              >
                <Shield size={14} />
                Admin Panel
              </button>
            )}
            
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{user.role} Account</p>
            </div>

            <button 
              onClick={onLogout}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-white/5 py-12 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-500 text-sm">© 2026 GolfCharity Platform. All rights reserved.</p>
          <div className="flex gap-8 text-zinc-500 text-sm">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
