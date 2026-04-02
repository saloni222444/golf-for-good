import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  CreditCard, 
  Trophy, 
  Heart, 
  BarChart3, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  Target
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onSwitchView: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab, onLogout, onSwitchView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'draws', label: 'Draws', icon: Target },
    { id: 'winners', label: 'Winners', icon: Trophy },
    { id: 'charities', label: 'Charities', icon: Heart },
    { id: 'user-view', label: 'User View', icon: LayoutDashboard },
  ];

  const handleTabClick = (id: string) => {
    if (id === 'user-view') {
      onSwitchView();
      return;
    }
    setActiveTab(id);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans relative bg-mesh">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="glass-dark border-r border-white/5 flex flex-col z-50 relative"
      >
        <div className="p-8 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-black font-black text-xl">G</span>
              </div>
              <span className="font-black text-xl tracking-tighter font-display bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                ADMIN
              </span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
          >
            {isSidebarOpen ? <X size={20} className="text-zinc-400" /> : <Menu size={20} className="text-zinc-400" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative ${
                activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-zinc-500 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-emerald-400' : 'group-hover:text-white transition-colors'} />
              {isSidebarOpen && <span className="font-bold text-sm tracking-tight font-display">{item.label}</span>}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm font-display"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <header className="sticky top-0 z-40 glass-dark border-b border-white/5 px-10 py-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] font-display mb-1">Management</span>
            <h1 className="text-3xl font-black capitalize font-display tracking-tight">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-black font-display tracking-tight">System Admin</p>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Superuser Access</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg shadow-lg shadow-emerald-500/5">
               SA
             </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
