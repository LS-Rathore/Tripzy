import { useState, useEffect } from 'react';
import type { TripFormData } from '../../types/TripForm';
import type { TripConcept } from '../../types/Trip';

const INTEREST_OPTIONS = [
  "Foodie",
  "Adventure",
  "Nature",
  "Culture",
  "Beaches",
  "Photo Ops",
  "Mountains",
  "History",
  "Wildlife",
  "Shopping",
  "Spiritual",
  "Nightlife"
];

const LOADING_MESSAGES = [
  "Dreaming up your destination outline...",
  "Consulting the local chai stalls...",
  "Drafting three distinct travel paces...",
  "Curating authentic offbeat highlights...",
  "Vibe-checking your travel budget..."
];

export interface PlanTripFormProps {
  onTopHalfComplete?: (isComplete: boolean) => void;
  onConceptsLoaded: (concepts: TripConcept[], formData: TripFormData) => void;
}

export default function PlanTripForm({ onTopHalfComplete, onConceptsLoaded }: PlanTripFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<TripFormData>({
    city: '',
    numberOfDays: 0,
    budgetPerDay: 0,
    travelStyle: 'Mid-range',
    interests: [],
    travelerType: 'Solo',
    startingFrom: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (onTopHalfComplete) {
      const isComplete = formData.city.trim() !== '' && formData.numberOfDays > 0 && formData.budgetPerDay > 0;
      onTopHalfComplete(isComplete);
    }
  }, [formData.city, formData.numberOfDays, formData.budgetPerDay, onTopHalfComplete]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.city.trim()) {
      newErrors.city = 'Destination city is required.';
    }
    if (formData.numberOfDays < 1 || formData.numberOfDays > 30) {
      newErrors.numberOfDays = 'Days must be between 1 and 30.';
    }
    if (formData.budgetPerDay <= 0) {
      newErrors.budgetPerDay = 'Budget must be a positive number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    
    try {
      const res = await fetch(`${API_URL}/api/trips/concepts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: formData.city,
          startingFrom: formData.startingFrom || undefined,
          numberOfDays: formData.numberOfDays,
          budgetPerDay: formData.budgetPerDay,
          travelStyle: formData.travelStyle,
          interests: formData.interests,
          travelerType: formData.travelerType,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate concepts');
      }

      const data = await res.json();
      onConceptsLoaded(data.concepts, formData);
    } catch (err: any) {
      console.error(err);
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[400px] animate-fade-up">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-tripzy-orange/30 blur-[20px] rounded-full animate-blob-morph"></div>
          <div className="absolute inset-2 bg-brand-teal/30 blur-[15px] rounded-full animate-blob-morph" style={{ animationDelay: '1s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-tripzy-orange animate-bounce">travel_explore</span>
          </div>
        </div>
        
        <div className="h-8 relative overflow-hidden w-full max-w-sm">
          {LOADING_MESSAGES.map((msg, idx) => (
            <p 
              key={idx}
              className={`absolute inset-0 w-full font-body-md font-bold text-tripzy-text transition-all duration-500 transform ${
                idx === loadingMsgIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination */}
        <div className="space-y-2 col-span-full">
          <label className="block text-base font-black uppercase tracking-tight text-brand-teal font-display-lg">Where to next?</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tripzy-orange font-bold text-[20px]">location_on</span>
            <input 
              type="text" 
              placeholder="Enter a dream city..."
              className="w-full py-3 pl-10 pr-4 rounded-xl border-[3px] border-black focus:ring-0 focus:border-tripzy-orange text-lg font-extrabold placeholder-outline-variant/60 transition-all font-body-md text-tripzy-text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          {errors.city && <p className="text-error font-bold text-sm mt-1 ml-1">{errors.city}</p>}
        </div>

        {/* Days */}
        <div className="space-y-2">
          <label className="block text-base font-black uppercase tracking-tight text-brand-teal font-display-lg">For how long?</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tripzy-orange font-bold text-[20px]">calendar_today</span>
            <input 
              type="number" 
              min="1" max="30"
              placeholder="Days"
              className="w-full py-3 pl-10 pr-4 rounded-xl border-[3px] border-black focus:ring-0 focus:border-tripzy-orange text-lg font-extrabold placeholder-outline-variant/60 transition-all font-body-md text-tripzy-text"
              value={formData.numberOfDays || ''}
              onChange={(e) => setFormData({ ...formData, numberOfDays: parseInt(e.target.value) || 0 })}
            />
          </div>
          {errors.numberOfDays && <p className="text-error font-bold text-sm mt-1 ml-1">{errors.numberOfDays}</p>}
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="block text-base font-black uppercase tracking-tight text-brand-teal font-display-lg">Budget (₹)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tripzy-orange font-bold text-[20px]">payments</span>
            <input 
              type="number" 
              min="0"
              placeholder="Amount"
              className="w-full py-3 pl-10 pr-4 rounded-xl border-[3px] border-black focus:ring-0 focus:border-tripzy-orange text-lg font-extrabold placeholder-outline-variant/60 transition-all font-body-md text-tripzy-text"
              value={formData.budgetPerDay || ''}
              onChange={(e) => setFormData({ ...formData, budgetPerDay: parseInt(e.target.value) || 0 })}
            />
          </div>
          {errors.budgetPerDay && <p className="text-error font-bold text-sm mt-1 ml-1">{errors.budgetPerDay}</p>}
        </div>
      </div>

      {/* Travel Style */}
      <div className="space-y-3">
        <label className="block text-base font-black uppercase tracking-tight text-brand-teal font-display-lg">Choose your Style!</label>
        <div className="flex flex-wrap gap-3">
          {(["Budget", "Mid-range", "Luxury"] as const).map(style => {
            const isActive = formData.travelStyle === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => setFormData({ ...formData, travelStyle: style })}
                className={`px-6 py-2 rounded-xl border-[3px] border-black font-black text-base transition-all active:scale-95 ${
                  isActive 
                    ? 'bg-tripzy-orange text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white text-tripzy-text hover:bg-tripzy-orange/10'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <label className="block text-base font-black uppercase tracking-tight text-brand-teal font-display-lg">Pick Your Vibes!</label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map(interest => {
            const isActive = formData.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-1.5 rounded-full border-2 border-black font-extrabold text-sm transition-all ${
                  isActive 
                    ? 'bg-tripzy-orange text-white border-tripzy-orange shadow-[0_3px_8px_rgba(249,115,22,0.3)] -translate-y-0.5' 
                    : 'bg-white text-tripzy-text hover:bg-tripzy-orange/20'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Who's Traveling */}
      <div className="space-y-3">
        <label className="block text-base font-black uppercase tracking-tight text-brand-teal font-display-lg">Who's Coming Along?</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: "Solo", icon: "person" },
            { type: "Couple", icon: "favorite" },
            { type: "Family", icon: "family_restroom" },
            { type: "Friends", icon: "groups" }
          ].map(({ type, icon }) => {
            const isActive = formData.travelerType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, travelerType: type as any })}
                className={`group p-4 rounded-xl border-[3px] border-black flex flex-col items-center gap-1 transition-all hover:-translate-y-1 ${
                  isActive 
                    ? 'bg-brand-teal text-white border-brand-teal scale-[1.03]' 
                    : 'bg-white text-tripzy-text'
                }`}
              >
                <span className="material-symbols-outlined text-3xl">{icon}</span>
                <span className="font-black font-display-lg text-sm">{type === "Friends" ? "Squad" : type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Starting From */}
      <div className="space-y-2">
        <label className="block text-base font-black uppercase tracking-tight text-brand-teal font-display-lg">Starting From (Optional)</label>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="e.g. New Delhi"
            className="w-full py-3 px-4 rounded-xl border-[3px] border-black focus:ring-0 focus:border-tripzy-orange text-lg font-extrabold placeholder-outline-variant/60 transition-all font-body-md text-tripzy-text"
            value={formData.startingFrom}
            onChange={(e) => setFormData({ ...formData, startingFrom: e.target.value })}
          />
        </div>
      </div>

      {errors.submit && (
        <div className="p-4 rounded-xl bg-red-100 border-2 border-red-400 text-red-700 font-bold text-sm">
          {errors.submit}
        </div>
      )}

      {/* Submit */}
      <button 
        type="submit"
        disabled={!formData.city.trim() || formData.numberOfDays < 1 || formData.budgetPerDay <= 0}
        className="w-full py-4 mt-2 rounded-xl bg-black text-white font-black text-xl flex items-center justify-center gap-2 shadow-xl hover:bg-brand-teal hover:shadow-brand-teal/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black font-display-lg"
      >
        Let's Go! <span className="material-symbols-outlined text-2xl">bolt</span>
      </button>

    </form>
  );
}
