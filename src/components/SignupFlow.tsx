import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check, ArrowRight, Heart } from 'lucide-react';

interface SignupFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  charities: any[];
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ onComplete, onCancel, loading, charities }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    handicap: '',
    plan: 'monthly',
    charityId: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    console.log('SignupFlow: handleSubmit initiated');
    try {
      await onComplete(formData);
      console.log('SignupFlow: onComplete success');
      setIsSuccess(true);
    } catch (err) {
      console.error('SignupFlow: handleSubmit failed', err);
      // Error is handled in App.tsx via setMessage
    }
  };

  const steps = [
    { id: 1, title: 'Personal Details' },
    { id: 2, title: 'Choose Your Plan' },
    { id: 3, title: 'Select Charity' }
  ];

  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         charity.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Note: Our mock charities don't have categories yet, so for now we'll just show all if 'All' is selected
    // or if we add categories to the DB later, this will work.
    // For now, let's assume 'All' shows everything.
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a4731] font-sans p-6 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mt-12 mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4">Join the Movement</h1>
        <p className="text-lg opacity-70">Play with purpose. Drive real change.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-12">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step > s.id ? 'bg-[#1a4731] text-white' : 
                step === s.id ? 'bg-[#1a4731] text-white' : 
                'bg-zinc-200 text-zinc-400'
              }`}>
                {step > s.id ? <Check size={20} /> : s.id}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-[2px] ${step > s.id ? 'bg-[#1a4731]' : 'bg-zinc-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Card */}
      <motion.div 
        key={isSuccess ? 'success' : step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10 border border-zinc-100"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12 space-y-6"
            >
              <div className="w-20 h-20 bg-[#1a4731] rounded-full flex items-center justify-center mx-auto shadow-xl shadow-[#1a4731]/20">
                <Check size={40} className="text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold mb-2">Registration Complete!</h2>
                <p className="text-zinc-500">Welcome to Golf For Good. Redirecting you to your dashboard...</p>
              </div>
              <div className="flex justify-center pt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1a4731]"></div>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">1. Personal Details</h2>
                <p className="text-zinc-500">Tell us a bit about yourself.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80">First Name</label>
                  <input 
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    placeholder="e.g. John"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1a4731] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80">Last Name</label>
                  <input 
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    placeholder="e.g. Doe"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1a4731] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold opacity-80">Email</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1a4731] outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold opacity-80">Password</label>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1a4731] outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold opacity-80">Current Handicap (Optional)</label>
                <input 
                  type="text"
                  value={formData.handicap}
                  onChange={e => setFormData({...formData, handicap: e.target.value})}
                  placeholder="e.g. 15.4"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1a4731] outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={onCancel}
                  className="flex-1 py-4 font-bold text-zinc-500 hover:text-[#1a4731] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.password}
                  className="flex-[2] bg-[#1a4731] text-white py-4 rounded-xl font-bold hover:bg-[#123323] transition-all shadow-lg shadow-[#1a4731]/20 disabled:opacity-50"
                >
                  Continue to Plans
                </button>
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">2. Choose Your Plan</h2>
                <p className="text-zinc-500">Select a subscription that fits your impact goals.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setFormData({...formData, plan: 'monthly'})}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    formData.plan === 'monthly' ? 'border-[#1a4731] bg-[#1a4731]/5' : 'border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xl">Monthly Plan</span>
                    <span className="text-2xl font-bold">£10<span className="text-sm font-normal text-zinc-500">/mo</span></span>
                  </div>
                  <p className="text-sm text-zinc-500">Perfect for casual players. Includes 4 draw entries per month.</p>
                </button>

                <button 
                  onClick={() => setFormData({...formData, plan: 'yearly'})}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    formData.plan === 'yearly' ? 'border-[#1a4731] bg-[#1a4731]/5' : 'border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xl">Yearly Plan</span>
                    <span className="text-2xl font-bold">£100<span className="text-sm font-normal text-zinc-500">/yr</span></span>
                  </div>
                  <p className="text-sm text-zinc-500">Best value. Save £20 and get 50 draw entries per year.</p>
                  <div className="mt-4 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    SAVE 17%
                  </div>
                </button>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={handleBack}
                  className="flex-1 py-4 font-bold text-zinc-500 hover:text-[#1a4731] transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-[2] bg-[#1a4731] text-white py-4 rounded-xl font-bold hover:bg-[#123323] transition-all shadow-lg shadow-[#1a4731]/20"
                >
                  Select Charity
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-serif font-bold mb-2">3. Select Charity</h2>
                  <p className="text-zinc-500">Choose where your impact goes.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {filteredCharities.length} Causes Available
                  </span>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a cause..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-12 py-3 focus:ring-2 focus:ring-[#1a4731] outline-none transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {['All', 'Environment', 'Medical', 'Education', 'Animal Welfare', 'Disaster Relief'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        cat === selectedCategory ? 'bg-[#1a4731] text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCharities.length > 0 ? filteredCharities.map(charity => (
                  <button 
                    key={charity.id}
                    onClick={() => setFormData({...formData, charityId: charity.id})}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 group ${
                      formData.charityId === charity.id ? 'border-[#1a4731] bg-[#1a4731]/5' : 'border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      formData.charityId === charity.id ? 'bg-[#1a4731] text-white scale-110' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200'
                    }`}>
                      {formData.charityId === charity.id ? <Check size={28} /> : <Heart size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg">{charity.name}</h4>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Featured</span>
                      </div>
                      <p className="text-sm text-zinc-500 line-clamp-1">{charity.description}</p>
                    </div>
                  </button>
                )) : (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-300">
                      <Heart size={32} />
                    </div>
                    <p className="text-zinc-400 font-medium">No charities found. Try a different search.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={handleBack}
                  className="flex-1 py-4 font-bold text-zinc-500 hover:text-[#1a4731] transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !formData.charityId}
                  className="flex-[2] bg-[#1a4731] text-white py-4 rounded-xl font-bold hover:bg-[#123323] transition-all shadow-lg shadow-[#1a4731]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : 'Complete Registration'} <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1a4731;
        }
      `}</style>
    </div>
  );
};
