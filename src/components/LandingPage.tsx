import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Heart, 
  Award, 
  ChevronRight, 
  Target, 
  Users, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  jackpotPool: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, jackpotPool }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-black font-black text-xl">G</span>
            </div>
            <span className="font-black text-xl tracking-tighter font-display hidden sm:block">GOLF FOR GOOD</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="px-6 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors font-display"
            >
              Login
            </button>
            <button 
              onClick={onSignup}
              className="px-6 py-2 text-sm font-black bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 font-display"
            >
              Join the Movement
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 overflow-hidden bg-mesh">
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" 
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-xs font-black uppercase tracking-widest font-display">
                    The Future of Golf Charity
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter font-display"
                >
                  Play with <br />
                  <span className="text-emerald-500">purpose.</span> <br />
                  <span className="italic font-serif font-light text-white/40">Drive real change.</span>
                </motion.h1>
              </div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl font-display font-light"
              >
                The first subscription platform where your golf score enters you into monthly prize draws, and every swing supports global charities.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-6"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSignup}
                  className="px-10 py-5 bg-emerald-500 text-black font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/40 flex items-center gap-3 font-display text-xl"
                >
                  Join the Movement <ArrowRight size={24} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 glass-dark border-white/10 text-white font-bold rounded-2xl transition-all font-display text-xl"
                >
                  Explore Charities
                </motion.button>
              </motion.div>
            </div>

            {/* Golfer Animation Element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                {/* Background Glows */}
                <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-emerald-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
                
                {/* Golfer Silhouette/Illustration Container */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    {/* The "Golfer" - Using a stylized SVG for a premium look */}
                    <svg viewBox="0 0 200 200" className="w-[400px] h-[400px] drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <defs>
                        <linearGradient id="golfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      {/* Stylized Golfer Body */}
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        d="M100,160 L100,100 L120,60 L110,40 M100,100 L80,60 L90,40"
                        stroke="url(#golfGrad)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Head */}
                      <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 }}
                        cx="100" cy="30" r="8"
                        fill="url(#golfGrad)"
                      />
                      {/* Golf Club Swing Path */}
                      <motion.path
                        animate={{ 
                          rotate: [0, -10, 20, 0],
                          transformOrigin: "100px 80px"
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        d="M100,80 L160,20"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-80"
                      />
                      {/* Energy/Swing Lines */}
                      <motion.path
                        animate={{ 
                          opacity: [0, 1, 0],
                          pathLength: [0, 1, 1],
                          scale: [0.8, 1.2, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        d="M140,40 Q170,60 150,100"
                        stroke="#10b981"
                        strokeWidth="1"
                        fill="none"
                        className="opacity-40"
                      />
                    </svg>

                    {/* Floating Jackpot Badge Overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="absolute -bottom-4 -right-4 glass-dark p-6 rounded-3xl border-emerald-500/30 shadow-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                          <Award className="text-black" size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Current Jackpot</p>
                          <p className="text-2xl font-black text-white">£{jackpotPool.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-20, 20, -20],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      className="absolute w-1 h-1 bg-emerald-500 rounded-full blur-[1px]"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 3) * 20}%`
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-dark p-1 rounded-[3rem] border-white/5 shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {[
                { label: 'Total Contributed', value: '£12,450', color: 'text-emerald-500' },
                { label: 'Current Jackpot', value: `£${jackpotPool.toLocaleString()}`, color: 'text-pink-500' },
                { label: 'Active Players', value: '1,240', color: 'text-white' },
                { label: 'Prizes Awarded', value: '84', color: 'text-amber-500' },
              ].map((stat, i) => (
                <div key={i} className="p-10 text-center space-y-3 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] font-display relative z-10">{stat.label}</p>
                  <p className={`text-4xl font-black font-display relative z-10 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 mb-24"
          >
            <h2 className="text-5xl md:text-7xl font-black font-display tracking-tight">How the platform works</h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">A simple, transparent system designed to maximize impact and reward participation.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                step: '01', 
                title: 'Subscribe & Play', 
                desc: 'Choose a plan and select your preferred charity. Play golf, submit your Stableford scores, and track your performance.',
                icon: Target,
                color: 'bg-emerald-500'
              },
              { 
                step: '02', 
                title: 'Earn Draw Entries', 
                desc: 'Your scores generate numbers for the monthly draw. The more you play, the better your chances to win the jackpot.',
                icon: Award,
                color: 'bg-pink-500'
              },
              { 
                step: '03', 
                title: 'Make an Impact', 
                desc: 'A guaranteed percentage of your subscription goes directly to your chosen charity. Track your lifetime contribution.',
                icon: Heart,
                color: 'bg-amber-500'
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ y: -15, backgroundColor: "rgba(255,255,255,0.03)" }}
                className="glass-dark p-12 rounded-[3.5rem] border-white/5 space-y-8 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <item.icon size={120} />
                </div>
                <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon size={40} className="text-black" />
                </div>
                <div className="space-y-4">
                  <span className="text-emerald-500 font-black font-display text-sm tracking-widest">{item.step}</span>
                  <h3 className="text-3xl font-black font-display">{item.title}</h3>
                  <p className="text-zinc-500 leading-relaxed text-lg font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="py-40 px-6 bg-white/[0.02] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-5xl md:text-7xl font-black font-display tracking-tight">Featured Causes</h2>
              <p className="text-xl text-zinc-500 max-w-xl font-light">Every subscription makes a difference. Meet some of the incredible organizations our community supports.</p>
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 glass-dark border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-all flex items-center gap-3 text-lg"
            >
              View All Charities <ChevronRight size={20} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: 'Green Earth Initiative', category: 'Environment', image: 'https://picsum.photos/seed/green/800/600' },
              { name: 'Global Health Fund', category: 'Medical', image: 'https://picsum.photos/seed/health/800/600' },
              { name: 'Education for All', category: 'Education', image: 'https://picsum.photos/seed/edu/800/600' },
            ].map((charity, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden mb-8 shadow-2xl">
                  <img 
                    src={charity.image} 
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-10 left-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="px-4 py-1.5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                      {charity.category}
                    </span>
                    <h3 className="text-3xl font-black text-white font-display">{charity.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-6 relative overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-emerald-500/10 blur-[150px] rounded-full translate-y-1/2" 
        />
        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black font-display tracking-tight leading-[0.85]"
          >
            Ready to make your <br />
            <span className="text-emerald-500">game matter?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-zinc-400 font-light max-w-3xl mx-auto"
          >
            Join thousands of golfers playing for a purpose. Start your subscription today and enter this month's draw.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(16, 185, 129, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignup}
            className="px-16 py-8 bg-emerald-500 text-black font-black rounded-[2.5rem] transition-all shadow-2xl shadow-emerald-500/40 text-2xl font-display"
          >
            Start Your Journey
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">G</span>
              </div>
              <span className="font-black text-lg tracking-tighter font-display">GOLF FOR GOOD</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              A platform where every swing makes an impact. Join our movement to play with purpose, win prizes, and support charities worldwide.
            </p>
          </div>
          
          {[
            { title: 'Platform', links: ['Charities', 'Draws', 'Winners', 'Impact'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Press'] },
            { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Draw Rules', 'Cookie Policy'] },
          ].map((col, i) => (
            <div key={i} className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-widest font-display">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-zinc-500 hover:text-emerald-500 transition-colors text-sm">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs">© 2026 Golf For Good. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-zinc-600 hover:text-white text-xs transition-colors">Twitter</a>
            <a href="#" className="text-zinc-600 hover:text-white text-xs transition-colors">Instagram</a>
            <a href="#" className="text-zinc-600 hover:text-white text-xs transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
