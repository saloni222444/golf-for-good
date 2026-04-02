import React from 'react';
import { Award, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface WinningsTableProps {
  winners: any[];
  onRefresh?: () => void;
}

export const WinningsTable: React.FC<WinningsTableProps> = ({ winners, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="glass-dark p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden group transition-all duration-500 hover:border-white/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">Your Winnings</h3>
            <p className="text-sm text-zinc-500">Track your prizes and payouts.</p>
          </div>
        </div>

        {onRefresh && (
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Winnings"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="relative z-10">
        {winners.length > 0 ? (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  <th className="pb-2 pl-4">Category</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((w, i) => (
                  <motion.tr 
                    key={w.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 hover:bg-white/10 transition-colors group/row"
                  >
                    <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-white/5 group-hover/row:border-emerald-500/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          w.prizeCategory === 'JACKPOT' ? 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                          w.prizeCategory === 'HIGH' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-zinc-500'
                        }`} />
                        <span className="font-bold text-sm font-display">{w.prizeCategory}</span>
                      </div>
                    </td>
                    <td className="py-4 border-y border-white/5 group-hover/row:border-emerald-500/30 transition-colors">
                      <span className="font-black text-emerald-500 text-glow">£{w.prizeAmount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 border-y border-white/5 group-hover/row:border-emerald-500/30 transition-colors">
                      <div className="flex items-center gap-2">
                        {w.status === 'paid' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        ) : w.status === 'approved' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> Approved
                          </span>
                        ) : w.status === 'rejected' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right rounded-r-2xl border-y border-r border-white/5 group-hover/row:border-emerald-500/30 transition-colors">
                      <span className="text-[10px] text-zinc-500 font-mono">{new Date(w.createdAt).toLocaleDateString()}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-zinc-600">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-zinc-400 font-bold font-display">No winnings recorded yet.</p>
                <p className="text-xs text-zinc-500">Winnings are automatically tracked here after each monthly draw.</p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-2">How to win?</p>
                <ul className="text-[10px] text-zinc-500 text-left space-y-1 list-disc list-inside">
                  <li>Maintain an active subscription</li>
                  <li>Enter at least 5 scores per month</li>
                  <li>Match 3 or more numbers in the draw</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
