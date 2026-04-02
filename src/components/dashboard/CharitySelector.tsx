import React from 'react';
import { Heart, CheckCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface CharitySelectorProps {
  charities: any[];
  selectedCharityId?: string;
  onSelectCharity: (id: string) => void;
}

export const CharitySelector: React.FC<CharitySelectorProps> = ({ charities, selectedCharityId, onSelectCharity }) => {
  return (
    <div className="glass-dark p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden group transition-all duration-500 hover:border-white/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-red-500/10 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">Charity Selection</h3>
            <p className="text-sm text-zinc-500">Choose where your contributions go.</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          Min 10% Contribution
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {charities.map((c, i) => (
          <motion.div 
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelectCharity(c.id)}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all group/charity relative overflow-hidden ${
              selectedCharityId === c.id 
                ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/10' 
                : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h4 className={`font-bold text-lg transition-colors font-display ${selectedCharityId === c.id ? 'text-red-400' : 'text-white'}`}>
                {c.name}
              </h4>
              {selectedCharityId === c.id && (
                <CheckCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <p className="text-sm text-zinc-500 line-clamp-2 mb-6 group-hover/charity:text-zinc-400 transition-colors relative z-10">
              {c.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 relative z-10">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Raised: £{c.totalReceivedAmount.toFixed(0)}</span>
              <ExternalLink className="w-3 h-3 text-zinc-500 opacity-0 group-hover/charity:opacity-100 transition-opacity" />
            </div>
            
            {selectedCharityId === c.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
