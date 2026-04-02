import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Upload, 
  Search, 
  Filter, 
  User as UserIcon,
  Target,
  AlertCircle,
  Clock,
  MoreVertical
} from 'lucide-react';

interface Winner {
  id: string;
  userId: string;
  drawId: string;
  matchCount: number;
  prizeCategory: string;
  prizeAmount: number;
  status: string;
  proofUrl?: string;
  createdAt: string;
}

interface WinnerManagerProps {
  winners: Winner[];
  onApprove: (winnerId: string) => void;
  onReject: (winnerId: string) => void;
  onPay: (winnerId: string) => void;
  onUploadProof: (winnerId: string) => void;
}

const WinnerManager: React.FC<WinnerManagerProps> = ({ 
  winners, 
  onApprove, 
  onReject, 
  onPay, 
  onUploadProof 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filteredWinners = winners.filter(winner => {
    const matchesSearch = winner.userId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          winner.drawId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || winner.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by User ID or Draw ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-10 pr-8 focus:outline-none focus:border-emerald-500/50 transition-all text-sm appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Winners Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Winner</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Draw</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prize</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredWinners.length > 0 ? (
                filteredWinners.map((winner) => (
                  <motion.tr 
                    key={winner.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <UserIcon size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">User ID: {winner.userId}</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock size={10} /> {new Date(winner.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-gray-500" />
                        <p className="text-xs font-mono text-gray-300">#{winner.drawId.slice(-6).toUpperCase()}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-emerald-400">£{winner.prizeAmount.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{winner.prizeCategory}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(winner.status)}`}>
                        {winner.status === 'paid' && <CheckCircle2 size={12} />}
                        {winner.status === 'pending' && <Clock size={12} />}
                        {winner.status === 'rejected' && <XCircle size={12} />}
                        {winner.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {winner.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => onApprove(winner.id)}
                              className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all"
                              title="Approve"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button 
                              onClick={() => onReject(winner.id)}
                              className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {winner.status === 'approved' && (
                          <button 
                            onClick={() => onPay(winner.id)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            <CreditCard size={14} />
                            Mark Paid
                          </button>
                        )}
                        {winner.status === 'paid' && !winner.proofUrl && (
                          <button 
                            onClick={() => onUploadProof(winner.id)}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10"
                          >
                            <Upload size={14} />
                            Upload Proof
                          </button>
                        )}
                        {winner.proofUrl && (
                          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Proof Uploaded
                          </span>
                        )}
                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <Trophy size={40} className="opacity-20" />
                      <p>No winners found matching your criteria.</p>
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

export default WinnerManager;
