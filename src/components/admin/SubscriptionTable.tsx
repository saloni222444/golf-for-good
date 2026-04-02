import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Calendar, 
  History, 
  XCircle, 
  RefreshCw, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Search
} from 'lucide-react';

interface Subscription {
  id: string;
  userId: string;
  planType: string;
  status: string;
  startDate: string;
  expiryDate: string;
  transactionId: string;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onExpire: (subId: string) => void;
  onRenew: (subId: string) => void;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ subscriptions, onExpire, onRenew }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSubs = subscriptions.filter(sub => 
    sub.userId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sub.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by User ID or Transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User ID</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dates</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSubs.length > 0 ? (
                filteredSubs.map((sub) => (
                  <motion.tr 
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <History size={14} />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-gray-400">{sub.transactionId}</p>
                          <p className="text-[10px] text-gray-600">ID: {sub.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-medium text-gray-300">{sub.userId}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        sub.planType === 'yearly' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        <CreditCard size={12} />
                        {sub.planType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {sub.status === 'active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> Start: {new Date(sub.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Calendar size={10} /> End: {new Date(sub.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {sub.status === 'active' ? (
                          <button 
                            onClick={() => onExpire(sub.id)}
                            className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                            title="Force Expire"
                          >
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => onRenew(sub.id)}
                            className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all"
                            title="Manually Renew"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <CreditCard size={40} className="opacity-20" />
                      <p>No subscriptions found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
