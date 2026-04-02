import React from 'react';
import { Trophy, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DrawResultsProps {
  latestDraw: any;
  userMatchResult: any;
}

export const DrawResults: React.FC<DrawResultsProps> = ({ latestDraw, userMatchResult }) => {
  const hasDraw = !!latestDraw;
  const hasMatch = !!userMatchResult;

  return (
    <div className="glass-dark p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden group transition-all duration-500 hover:border-white/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">Latest Draw</h3>
            <p className="text-sm text-zinc-500">Monthly results and your matches.</p>
          </div>
        </div>
        {hasDraw && (
          <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            {latestDraw.drawMonth}
          </div>
        )}
      </div>

      {hasDraw ? (
        <div className="space-y-8 relative z-10">
          <div className="flex justify-center gap-3">
            {latestDraw.numbers.map((n: number, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                className="w-12 h-12 bg-amber-500 text-black font-black text-xl rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-amber-400/50 font-display"
              >
                {n}
              </motion.div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Result</p>
              {hasMatch && userMatchResult.matchCount >= 3 ? (
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                  <CheckCircle className="w-4 h-4" />
                  Winning Match!
                </div>
              ) : (
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  <XCircle className="w-4 h-4" />
                  No Match
                </div>
              )}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-black font-display">{hasMatch ? userMatchResult.matchCount : 0}<span className="text-sm font-bold text-zinc-500 ml-2 tracking-widest uppercase">/ 5 Matches</span></p>
                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest font-medium">Based on your latest 5 rounds.</p>
              </div>
              {hasMatch && userMatchResult.prizeAmount > 0 && (
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Potential Prize</p>
                  <p className="text-3xl font-black text-emerald-500 text-glow font-display">£{userMatchResult.prizeAmount.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl relative z-10 bg-white/[0.02]">
          <p className="text-zinc-500 text-sm">No draws have been conducted yet.</p>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-2">Next draw scheduled for end of month</p>
        </div>
      )}
    </div>
  );
};
