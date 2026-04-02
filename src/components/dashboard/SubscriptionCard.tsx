import React from 'react';
import { CreditCard, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SubscriptionCardProps {
  subscription: any;
  onSubscribe: (plan: 'monthly' | 'yearly') => void;
  onCancel: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onSubscribe, onCancel }) => {
  const isActive = subscription && subscription.status === 'active';
  const isExpired = subscription && subscription.status === 'expired';

  return (
    <div className="glass-dark p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden group transition-all duration-500 hover:border-white/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">Subscription</h3>
            <p className="text-sm text-zinc-500">Manage your membership plan.</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {isActive ? 'Active' : isExpired ? 'Expired' : 'Inactive'}
        </div>
      </div>

      {isActive ? (
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Current Plan</p>
              <p className="text-lg font-bold capitalize font-display">{subscription.planType}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Expiry Date</p>
              <p className="text-lg font-bold font-display">{new Date(subscription.expiryDate).toLocaleDateString()}</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="w-full bg-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 border border-white/5 text-zinc-400 font-bold py-4 rounded-2xl transition-all"
          >
            Cancel Subscription
          </button>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSubscribe('monthly')}
              className="bg-emerald-500 text-black font-bold p-6 rounded-2xl hover:bg-emerald-400 transition-all text-left shadow-lg shadow-emerald-500/20"
            >
              <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Monthly Plan</p>
              <p className="text-2xl font-black font-display">£25<span className="text-sm font-bold opacity-70">/mo</span></p>
              <p className="text-[10px] mt-4 opacity-70">Cancel anytime. £5 to charity.</p>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSubscribe('yearly')}
              className="bg-white/5 border border-white/10 text-white font-bold p-6 rounded-2xl hover:bg-white/10 transition-all text-left"
            >
              <p className="text-xs uppercase tracking-widest opacity-50 mb-1 text-emerald-500">Yearly Plan</p>
              <p className="text-2xl font-black font-display">£250<span className="text-sm font-bold opacity-50">/yr</span></p>
              <p className="text-[10px] mt-4 opacity-50">Save £50. £50 to charity.</p>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};
