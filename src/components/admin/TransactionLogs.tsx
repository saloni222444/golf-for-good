import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Calendar, 
  History, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
}

interface TransactionLogsProps {
  transactions: Transaction[];
}

const TransactionLogs: React.FC<TransactionLogsProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTransactions = transactions.filter(tx => 
    tx.userId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <motion.tr 
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <p className="font-mono text-[10px] text-gray-400">{tx.id}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-medium text-gray-300">{tx.userId}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">£{tx.amount.toLocaleString()}</span>
                        {tx.type === 'subscription' ? (
                          <ArrowUpRight size={12} className="text-emerald-400" />
                        ) : (
                          <ArrowDownLeft size={12} className="text-rose-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {tx.status === 'completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <History size={40} className="opacity-20" />
                      <p>No transactions found.</p>
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

export default TransactionLogs;
