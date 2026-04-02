import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  CreditCard, 
  Trophy, 
  Heart, 
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalPrizePool: number;
  totalCharityDonations: number;
  drawsConducted: number;
  jackpotRollover: number;
}

interface AnalyticsCardsProps {
  stats: AnalyticsStats;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      trend: '+12%',
      isPositive: true
    },
    {
      label: 'Active Subs',
      value: stats.activeSubscriptions,
      icon: CreditCard,
      color: 'emerald',
      trend: '+5%',
      isPositive: true
    },
    {
      label: 'Total Prize Pool',
      value: `£${stats.totalPrizePool.toLocaleString()}`,
      icon: Trophy,
      color: 'amber',
      trend: '+24%',
      isPositive: true
    },
    {
      label: 'Charity Donations',
      value: `£${stats.totalCharityDonations.toLocaleString()}`,
      icon: Heart,
      color: 'rose',
      trend: '+18%',
      isPositive: true
    },
    {
      label: 'Draws Conducted',
      value: stats.drawsConducted,
      icon: Target,
      color: 'purple',
      trend: '0%',
      isPositive: true
    },
    {
      label: 'Jackpot Rollover',
      value: `£${stats.jackpotRollover.toLocaleString()}`,
      icon: TrendingUp,
      color: 'indigo',
      trend: '-2%',
      isPositive: false
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl border ${getColorClasses(card.color)}`}>
              <card.icon size={24} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              card.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {card.trend}
            </div>
          </div>
          
          <h3 className="text-gray-400 text-sm font-medium mb-1">{card.label}</h3>
          <p className="text-3xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
