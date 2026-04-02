import React, { useState } from 'react';
import { Plus, History, ArrowUp, ArrowDown, Trash2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreManagerProps {
  scores: any[];
  onAddScore: (score: number) => void;
  onDeleteScore?: (scoreId: string) => void;
  disabled?: boolean;
}

export const ScoreManager: React.FC<ScoreManagerProps> = ({ scores, onAddScore, onDeleteScore, disabled }) => {
  const [newScore, setNewScore] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newScore);
    if (isNaN(val) || val < 1 || val > 45) {
      setError('Score must be between 1 and 45');
      return;
    }
    setError(null);
    onAddScore(val);
    setNewScore('');
  };

  const sortedScores = [...scores].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="glass-dark p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden group transition-all duration-500 hover:border-white/10">
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -ml-16 -mb-16 group-hover:bg-emerald-500/10 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">Score Entry</h3>
            <p className="text-sm text-zinc-500">Add your latest golf score.</p>
          </div>
        </div>
        <button 
          onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
          className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold text-zinc-400"
        >
          {sortOrder === 'newest' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
          {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input 
              type="number"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              placeholder="Enter score (1-45)"
              disabled={disabled}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-display"
            />
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-6 left-0 text-[10px] text-red-500 font-bold uppercase tracking-widest"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={disabled || !newScore}
            className="bg-emerald-500 text-black font-bold px-8 py-4 rounded-2xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
          >
            Add
          </motion.button>
        </div>
        {disabled && (
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest text-center mt-2">
            Active subscription required to enter scores
          </p>
        )}
      </form>

      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
          <div className="flex items-center gap-2">
            <History className="w-3 h-3" />
            Recent Scores (Last 5)
          </div>
          <span className="text-[10px] text-emerald-500/50">{scores.length}/5 Rounds</span>
        </div>
        {scores.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            <AnimatePresence mode="popLayout">
              {sortedScores.slice(0, 5).map((s, i) => (
                <motion.div 
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center group/score hover:border-emerald-500/30 transition-all relative aspect-square flex flex-col justify-center"
                >
                  {onDeleteScore && (
                    <button 
                      onClick={() => onDeleteScore(s.id)}
                      className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-500 opacity-0 group-hover/score:opacity-100 transition-all"
                      title="Delete score"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <p className="text-2xl font-black text-white group-hover/score:text-emerald-400 transition-colors font-display">{s.score}</p>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-tighter mt-1">{new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                </motion.div>
              ))}
              {[...Array(Math.max(0, 5 - scores.length))].map((_, i) => (
                <div key={`empty-${i}`} className="bg-white/[0.02] border border-dashed border-white/5 aspect-square rounded-2xl flex items-center justify-center text-zinc-800">
                  <Plus size={16} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-zinc-500 text-sm">No scores recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
