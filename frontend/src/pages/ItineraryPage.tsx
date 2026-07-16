import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import type { Trip, PrimaryDayPlan, AlternativeDayPlan, ItineraryOption } from '../types/Trip';

export default function ItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [activeDay, setActiveDay] = useState(1);
  const [activePlanType, setActivePlanType] = useState<'Primary' | 'Alt1' | 'Alt2'>('Primary');
  const [selections, setSelections] = useState<Record<string, number>>({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;
      try {
        const res = await fetch(`${API_URL}/api/trips/${tripId}`, {
          credentials: 'include', // essential to pass auth cookies
        });

        if (!res.ok) {
          throw new Error('Could not find your trip details.');
        }

        const data = await res.json();
        setTrip(data);

        // Pre-populate default selections (0th index for all slots)
        if (data.rawItinerary?.days) {
          const initialSelections: Record<string, number> = {};
          data.rawItinerary.days.forEach((d: any) => {
            const primaryPlan = d.dayPlans.find((p: any) => p.label === 'Primary');
            if (primaryPlan) {
              ['morning', 'afternoon', 'evening', 'breakfast', 'lunch', 'dinner'].forEach((slot) => {
                initialSelections[`${d.day}-${slot}`] = 0;
              });
            }
          });
          setSelections(initialSelections);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-tripzy-bg flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-12 h-12 border-[4px] border-outline-variant border-t-tripzy-orange rounded-full animate-spin mb-4" />
          <p className="font-label-sm text-on-surface-variant font-bold">Retrieving your trip...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-tripzy-bg flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <span className="material-symbols-outlined text-6xl text-error mb-4">warning</span>
          <h1 className="text-2xl font-black text-on-surface mb-2 font-display-lg">Oops!</h1>
          <p className="text-on-surface-variant font-medium mb-8">
            {error || "We couldn't retrieve your itinerary details."}
          </p>
          <Link
            to="/plan"
            className="px-6 py-3 rounded-xl border-[3px] border-black bg-white text-on-surface font-black text-sm btn-shadow active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
          >
            Start Over
          </Link>
        </div>
      </div>
    );
  }

  const itinerary = trip.rawItinerary;
  if (!itinerary) {
    return (
      <div className="min-h-screen bg-tripzy-bg flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-black text-on-surface mb-2">No itinerary generated.</h1>
          <Link to="/plan" className="text-tripzy-orange underline font-bold">Plan a trip now</Link>
        </div>
      </div>
    );
  }

  const currentDayData = itinerary.days.find((d) => d.day === activeDay);
  const primaryPlan = currentDayData?.dayPlans[0] as PrimaryDayPlan;
  const altPlan1 = currentDayData?.dayPlans[1] as AlternativeDayPlan;
  const altPlan2 = currentDayData?.dayPlans[2] as AlternativeDayPlan;

  // Calculate live daily cost based on selected options
  const getLiveDailyCost = () => {
    if (activePlanType !== 'Primary' || !primaryPlan) {
      const plan = activePlanType === 'Alt1' ? altPlan1 : altPlan2;
      return plan?.dailyCost || 0;
    }

    let cost = 0;
    const slots = ['morning', 'afternoon', 'evening'];
    const meals = ['breakfast', 'lunch', 'dinner'];

    slots.forEach((slot) => {
      const optionIdx = selections[`${activeDay}-${slot}`] || 0;
      const opt = (primaryPlan as any)[slot]?.options[optionIdx];
      if (opt) cost += opt.cost;
    });

    meals.forEach((meal) => {
      const optionIdx = selections[`${activeDay}-food-${meal}`] || 0;
      const opt = primaryPlan.food[meal as keyof typeof primaryPlan.food]?.options[optionIdx];
      if (opt) cost += opt.cost;
    });

    // Add transport costs
    primaryPlan.transport.forEach((t) => {
      cost += t.cost;
    });

    return cost;
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Popular':
        return 'bg-blue-100 text-blue-700 border-blue-400';
      case 'Hidden Gem':
        return 'bg-purple-100 text-purple-700 border-purple-400';
      case 'Budget-Friendly':
        return 'bg-emerald-100 text-emerald-700 border-emerald-400';
      case 'Highly Rated':
        return 'bg-amber-100 text-amber-700 border-amber-400';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-400';
    }
  };

  const renderSlotSelector = (slotKey: string, slotTitle: string, emoji: string, options: ItineraryOption[]) => {
    if (!options || options.length === 0) return null;
    const selectedIdx = selections[`${activeDay}-${slotKey}`] || 0;
    const selectedOption = options[selectedIdx] || options[0];

    return (
      <div className="bento-card bg-white p-5 rounded-2xl border-[3px] border-black space-y-4">
        <div className="flex justify-between items-center border-b-2 border-black/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <h3 className="font-headline-md font-bold text-lg text-on-surface">{slotTitle}</h3>
          </div>
          {options.length > 1 && (
            <div className="flex gap-2">
              {options.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelections((prev) => ({ ...prev, [`${activeDay}-${slotKey}`]: idx }))}
                  className={`w-8 h-8 rounded-lg border-2 border-black font-black text-xs transition-all ${
                    selectedIdx === idx
                      ? 'bg-tripzy-orange text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-on-surface hover:bg-tripzy-orange/10'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2 flex-wrap">
            <h4 className="font-extrabold text-base text-on-surface">{selectedOption.title}</h4>
            <span className="font-black text-sm text-brand-teal">
              {selectedOption.cost > 0 ? `₹${selectedOption.cost}` : 'Free'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>{selectedOption.location}</span>
          </div>
          <div className="pt-2">
            <span className={`inline-block px-2 py-0.5 rounded-full border-2 text-[10px] font-black uppercase tracking-wider ${getTagColor(selectedOption.tag)}`}>
              {selectedOption.tag}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant font-medium pt-2 border-t border-dashed border-black/10 italic">
            "{selectedOption.reason}"
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 bg-pattern -z-10"></div>
      
      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-12 space-y-10 animate-fade-up">
        {/* Header Section */}
        <div className="bento-card bg-white p-6 md:p-8 rounded-2xl border-[3px] border-black staggered-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="bg-brand-teal text-white font-black text-xs uppercase px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                {trip.travelStyle}
              </span>
              <span className="bg-secondary-container text-secondary font-black text-xs uppercase px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                {trip.travelerType}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight font-display-lg">
              {trip.city} Itinerary
            </h1>
            {trip.startingFrom && (
              <p className="text-on-surface-variant font-bold mt-1">
                Starting from: <span className="text-tripzy-orange">{trip.startingFrom}</span>
              </p>
            )}
          </div>
          <div className="text-left md:text-right bg-tripzy-orange/10 border-2 border-dashed border-tripzy-orange/40 p-4 rounded-xl">
            <span className="text-3xl block">📅</span>
            <span className="text-2xl font-black text-tripzy-orange font-display-lg block leading-none mt-1">
              {trip.numberOfDays} Days
            </span>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mt-1">
              Limit: ₹{trip.budgetPerDay.toLocaleString('en-IN')}/day
            </span>
          </div>
        </div>

        {/* Budget Flag & Local Tips Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Feasibility */}
          <div className={`bento-card p-6 rounded-2xl border-[3px] border-black ${itinerary.budgetFlag.isRealistic ? 'bg-emerald-50' : 'bg-rose-50'}`}>
            <h3 className="font-headline-md font-black text-lg mb-2 flex items-center gap-2">
              {itinerary.budgetFlag.isRealistic ? (
                <>
                  <span className="text-emerald-600">✅</span> Budget check passed
                </>
              ) : (
                <>
                  <span className="text-rose-600">⚠️</span> Budget Advisory
                </>
              )}
            </h3>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              {itinerary.budgetFlag.note || "Your budget is realistic for this destination!"}
            </p>
          </div>

          {/* Local Information */}
          <div className="bento-card bg-amber-50 p-6 rounded-2xl border-[3px] border-black">
            <h3 className="font-headline-md font-black text-lg text-amber-800 mb-2 flex items-center gap-2">
              ☀️ Local Wisdom
            </h3>
            <p className="text-xs text-on-surface-variant font-bold">
              Best season: <span className="text-amber-700 font-extrabold">{itinerary.bestTimeToVisit}</span>
            </p>
            <div className="mt-2 space-y-1">
              <span className="font-black text-[10px] uppercase tracking-wider text-amber-800/80">Things to avoid:</span>
              <ul className="text-xs text-on-surface-variant font-semibold list-disc pl-4 space-y-0.5">
                {itinerary.thingsToAvoid.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Concept Vibe Box */}
        <div className="bento-card bg-white p-5 rounded-2xl border-[3px] border-black">
          <div className="flex gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-tripzy-orange">Selected Concept</span>
              <h4 className="font-display-lg text-lg font-black text-on-surface">{trip.conceptName}</h4>
              <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">{trip.conceptVibe}</p>
            </div>
          </div>
        </div>

        {/* Day Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center border-b-[3px] border-black pb-4">
            {itinerary.days.map((d) => (
              <button
                key={d.day}
                onClick={() => {
                  setActiveDay(d.day);
                  setActivePlanType('Primary'); // Reset plan label on day change
                }}
                className={`px-5 py-2.5 rounded-xl border-[3px] border-black font-black text-sm transition-all bouncy-hover ${
                  activeDay === d.day
                    ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
                    : 'bg-white text-on-surface shadow-[4px_4px_0px_0px_#251913] hover:bg-tripzy-orange/10'
                }`}
              >
                Day {d.day}
              </button>
            ))}
          </div>

          {/* Current Day Sub-Tabs (Primary Route vs Alternatives) */}
          {currentDayData && (
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => setActivePlanType('Primary')}
                className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs transition-all ${
                  activePlanType === 'Primary'
                    ? 'bg-brand-teal text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-on-surface hover:bg-brand-teal/10'
                }`}
              >
                📍 Primary Route Plan
              </button>
              {altPlan1 && (
                <button
                  onClick={() => setActivePlanType('Alt1')}
                  className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs transition-all ${
                    activePlanType === 'Alt1'
                      ? 'bg-tripzy-orange text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-on-surface hover:bg-tripzy-orange/10'
                  }`}
                >
                  🎭 {altPlan1.label.replace('Alternative: ', '')}
                </button>
              )}
              {altPlan2 && (
                <button
                  onClick={() => setActivePlanType('Alt2')}
                  className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs transition-all ${
                    activePlanType === 'Alt2'
                      ? 'bg-tripzy-orange text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-on-surface hover:bg-tripzy-orange/10'
                  }`}
                >
                  🏔️ {altPlan2.label.replace('Alternative: ', '')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* active plan view */}
        {activePlanType === 'Primary' && primaryPlan ? (
          <div className="space-y-8 animate-fade-up">
            
            {/* Header info for daily cost */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border-[3px] border-black">
              <span className="font-extrabold text-sm text-on-surface-variant">Selected options daily cost:</span>
              <span className="font-black text-lg text-tripzy-orange font-display-lg">
                ₹{getLiveDailyCost().toLocaleString('en-IN')}
              </span>
            </div>

            {/* Timeline details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Morning & Afternoon & Evening Activities */}
              <div className="space-y-6">
                <h3 className="font-display-lg font-black text-xl text-brand-teal border-b-2 border-brand-teal pb-1">
                  Activities
                </h3>
                {renderSlotSelector('morning', 'Morning Activity', '🏛️', primaryPlan.morning.options)}
                {renderSlotSelector('afternoon', 'Afternoon Activity', '🌳', primaryPlan.afternoon.options)}
                {renderSlotSelector('evening', 'Evening Activity', '🌆', primaryPlan.evening.options)}
              </div>

              {/* Right Column: Breakfast, Lunch & Dinner */}
              <div className="space-y-6">
                <h3 className="font-display-lg font-black text-xl text-tripzy-orange border-b-2 border-tripzy-orange pb-1">
                  Food Stops
                </h3>
                {renderSlotSelector('food-breakfast', 'Breakfast', '☕', primaryPlan.food.breakfast.options)}
                {renderSlotSelector('food-lunch', 'Lunch', '🍲', primaryPlan.food.lunch.options)}
                {renderSlotSelector('food-dinner', 'Dinner', '🍛', primaryPlan.food.dinner.options)}
              </div>
            </div>

            {/* Transport Legs inside primary plan */}
            {primaryPlan.transport.length > 0 && (
              <div className="bento-card bg-white p-5 rounded-2xl border-[3px] border-black space-y-4">
                <h3 className="font-headline-md font-bold text-lg border-b-2 border-black/10 pb-2">
                  🚗 Route & Transit
                </h3>
                <div className="space-y-3">
                  {primaryPlan.transport.map((leg, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-semibold p-3 bg-surface-container rounded-xl border border-black/10">
                      <div>
                        <span className="text-on-surface-variant text-xs font-bold block uppercase tracking-wider">
                          Transit {idx + 1} ({leg.mode})
                        </span>
                        <span className="text-on-surface font-extrabold">
                          {leg.from} → {leg.to}
                        </span>
                      </div>
                      <span className="font-black text-brand-teal">₹{leg.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Alternatives View */
          <div className="bento-card bg-white p-6 md:p-8 rounded-2xl border-[3px] border-black space-y-6 animate-fade-up">
            <div className="flex justify-between items-start gap-4 flex-wrap border-b-2 border-black/10 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-tripzy-orange">Alternative Plan</span>
                <h3 className="font-display-lg text-2xl font-black text-on-surface mt-1">
                  {activePlanType === 'Alt1' ? altPlan1?.label : altPlan2?.label}
                </h3>
              </div>
              <div className="bg-tripzy-orange/10 p-3 rounded-lg border border-tripzy-orange/40">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Estimated Cost</span>
                <span className="text-lg font-black text-tripzy-orange block">
                  ₹{activePlanType === 'Alt1' ? altPlan1?.dailyCost : altPlan2?.dailyCost}
                </span>
              </div>
            </div>
            <p className="font-medium text-on-surface-variant leading-relaxed">
              {activePlanType === 'Alt1' ? altPlan1?.summary : altPlan2?.summary}
            </p>
            <div className="bg-surface-container p-4 rounded-xl border border-black/10 text-xs font-bold italic text-on-surface-variant">
              💡 To select this alternative plan for Day {activeDay}, simply follow this outline on your day out. It offers a fully thematic alternative to the primary slots!
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
