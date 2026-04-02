import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Play, 
  History, 
  Target, 
  Calendar, 
  Trophy, 
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Draw {
  id: string;
  drawDate: string;
  winningNumbers: number[];
  status: string;
  totalPrizePool: number;
}

interface DrawManagerProps {
  draws: Draw[];
  onCreateDraw: () => void;
  onRunDraw: (drawId: string) => void;
}

const DrawManager: React.FC<DrawManagerProps> = ({ draws, onCreateDraw, onRunDraw }) => {
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    await onCreateDraw();
    setIsCreating(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="text-emerald-400" size={24} />
            Draw Control System
          </h2>
          <p className="text-sm text-gray-500">Manage and execute prize draws manually.</p>
        </div>
        
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          {isCreating ? <RefreshCw className="animate-spin" size={20} /> : <Plus size={20} />}
          Create New Draw
        </button>
      </div>

      {/* Draw List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {draws.length > 0 ? (
          draws.map((draw, index) => (
            <motion.div
              key={draw.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-10 ${
                draw.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />

              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      draw.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      draw.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {draw.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Draw #{draw.id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(draw.drawDate).toLocaleDateString()} at {new Date(draw.drawDate).toLocaleTimeString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Prize Pool</p>
                  <p className="text-xl font-bold text-emerald-400">£{draw.totalPrizePool.toLocaleString()}</p>
                </div>
              </div>

              {/* Winning Numbers */}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Winning Numbers</p>
                <div className="flex gap-2">
                  {draw.winningNumbers.length > 0 ? (
                    draw.winningNumbers.map((num, i) => (
                      <div 
                        key={i}
                        className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm"
                      >
                        {num}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600 italic text-sm">
                      <Clock size={14} />
                      Waiting for execution...
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                {draw.status === 'pending' ? (
                  <button
                    onClick={() => onRunDraw(draw.id)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-3 rounded-xl font-bold transition-all border border-emerald-500/20"
                  >
                    <Play size={18} />
                    Run Draw Now
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <span className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <CheckCircle2 size={16} />
                      Draw Completed
                    </span>
                    <button 
                      onClick={() => onRunDraw(draw.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-white text-xs transition-colors"
                    >
                      <RefreshCw size={14} />
                      Re-run Simulation
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <History size={48} className="opacity-20" />
              <p>No draws found in the system.</p>
              <button
                onClick={handleCreate}
                className="text-emerald-400 hover:underline text-sm font-medium"
              >
                Create your first draw
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawManager;
