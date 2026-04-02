import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Plus, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  X,
  Save,
  AlertCircle
} from 'lucide-react';

interface Charity {
  id: string;
  name: string;
  description: string;
  totalReceivedAmount: number;
  userCount: number;
}

interface CharityManagerProps {
  charities: Charity[];
  onAdd: (charity: Omit<Charity, 'id' | 'totalReceivedAmount' | 'userCount'>) => void;
  onEdit: (id: string, updates: Partial<Charity>) => void;
  onDelete: (id: string) => void;
}

const CharityManager: React.FC<CharityManagerProps> = ({ charities, onAdd, onEdit, onDelete }) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({ name: '', description: '' });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', description: '' });
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    onEdit(id, formData);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const startEdit = (charity: Charity) => {
    setEditingId(charity.id);
    setFormData({ name: charity.name, description: charity.description });
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Heart className="text-rose-400" size={24} />
            Charity Management
          </h2>
          <p className="text-sm text-gray-500">Manage partner charities and monitor donations.</p>
        </div>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} />
            Add New Charity
          </button>
        )}
      </div>

      {/* Add Charity Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-emerald-500/20 rounded-2xl p-6"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-emerald-400">New Charity Details</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Charity Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
                  placeholder="e.g. Green Earth Foundation"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
                  placeholder="Short description of their mission..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-xl font-bold transition-all text-sm"
              >
                Save Charity
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Charity List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charities.length > 0 ? (
          charities.map((charity, index) => (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group relative overflow-hidden"
            >
              {editingId === charity.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, charity.id)} className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-emerald-400">Edit Charity</h3>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
                  />
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm h-20"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1.5 rounded-lg text-gray-400 hover:text-white transition-all text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-1.5 rounded-lg font-bold transition-all text-xs flex items-center gap-2"
                    >
                      <Save size={14} />
                      Update
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {charity.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 max-w-[80%]">
                        {charity.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEdit(charity)}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(charity.id)}
                        className="p-2 hover:bg-rose-500/10 rounded-lg text-gray-400 hover:text-rose-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Raised</p>
                      <p className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                        <TrendingUp size={16} />
                        £{charity.totalReceivedAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Supporters</p>
                      <p className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <Users size={16} />
                        {charity.userCount}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Active Partner Charity
                  </div>
                </>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-full bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <AlertCircle size={48} className="opacity-20" />
              <p>No charities found in the system.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="text-emerald-400 hover:underline text-sm font-medium"
              >
                Add your first charity partner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharityManager;
