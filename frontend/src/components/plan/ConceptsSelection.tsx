import { useState, useEffect, useRef } from 'react';
import type { TripConcept } from '../../types/Trip';

export interface ConceptsSelectionProps {
  concepts: TripConcept[];
  onSelect: (concept: TripConcept) => void;
  onBack: () => void;
  saving: boolean;
}

const GENERATION_STEPS = [
  { emoji: '🔍', label: 'Analyzing your preferences', detail: 'Understanding your travel style & budget...', duration: 3000 },
  { emoji: '🧠', label: 'AI is crafting your trip', detail: 'Generating day-by-day activities & sightseeing...', duration: 8000 },
  { emoji: '🍽️', label: 'Picking the best food spots', detail: 'Finding restaurants, cafés & street food for every meal...', duration: 6000 },
  { emoji: '🚗', label: 'Planning transport routes', detail: 'Mapping the most efficient routes between stops...', duration: 5000 },
  { emoji: '💰', label: 'Optimizing for your budget', detail: 'Estimating costs & checking budget feasibility...', duration: 4000 },
  { emoji: '✨', label: 'Adding final touches', detail: 'Pro tips, hidden gems & alternative plans...', duration: 4000 },
  { emoji: '🗺️', label: 'Almost there!', detail: 'Assembling your complete itinerary...', duration: 10000 },
];

export default function ConceptsSelection({ concepts, onSelect, onBack, saving }: ConceptsSelectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const stepStartTime = useRef(Date.now());
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!saving) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    stepStartTime.current = Date.now();
    const totalSteps = GENERATION_STEPS.length;

    const tick = () => {
      const elapsed = Date.now() - stepStartTime.current;
      const step = GENERATION_STEPS[currentStep];
      const stepProgress = Math.min(elapsed / step.duration, 1);

      // Progress for this step as fraction of total
      const baseProgress = (currentStep / totalSteps) * 100;
      const stepContrib = (stepProgress / totalSteps) * 100;
      const totalProgress = Math.min(baseProgress + stepContrib, 97); // never hit 100 until actual completion

      setProgress(totalProgress);

      if (stepProgress >= 1 && currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
        stepStartTime.current = Date.now();
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [saving, currentStep]);

  // Map concept IDs to custom styling configurations for visual distinction
  const getCardStyle = (id: string) => {
    switch (id) {
      case 'relaxed-explorer':
        return {
          bg: 'bg-secondary-container',
          accent: 'text-secondary',
          emoji: '🍃',
        };
      case 'balanced-highlights':
        return {
          bg: 'bg-white',
          accent: 'text-tripzy-orange',
          emoji: '✨',
        };
      case 'packed-adventurer':
        return {
          bg: 'bg-tertiary-fixed',
          accent: 'text-tertiary',
          emoji: '⚡',
        };
      default:
        return {
          bg: 'bg-white',
          accent: 'text-on-surface',
          emoji: '🗺️',
        };
    }
  };

  const getBudgetFitBadge = (fit: string) => {
    switch (fit) {
      case 'below':
        return (
          <span className="px-3 py-1 rounded-full border-2 border-black bg-emerald-400 text-black font-black text-xs uppercase tracking-wide">
            Below Budget
          </span>
        );
      case 'within':
        return (
          <span className="px-3 py-1 rounded-full border-2 border-black bg-amber-400 text-black font-black text-xs uppercase tracking-wide">
            Fits Budget
          </span>
        );
      case 'exceeds':
        return (
          <span className="px-3 py-1 rounded-full border-2 border-black bg-rose-400 text-black font-black text-xs uppercase tracking-wide">
            Exceeds Budget
          </span>
        );
      default:
        return null;
    }
  };

  const step = GENERATION_STEPS[currentStep];

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-[3px] border-black bg-white font-black text-sm btn-shadow active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back
        </button>
        <span className="font-black text-sm uppercase tracking-widest text-tripzy-orange">Step Two: Pick Vibe</span>
      </div>

      <div className="text-center md:text-left space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight font-display-lg">
          Pick Your Travel Vibe! 🗺️
        </h2>
        <p className="text-on-surface-variant font-medium max-w-xl">
          Choose a direction for your itinerary. We'll generate the full day-by-day plan based on this choice.
        </p>
      </div>

      {saving ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center bg-white rounded-2xl border-[3px] border-black staggered-shadow animate-fade-up">
          
          {/* Animated emoji icon */}
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-tripzy-orange/20 blur-[20px] rounded-full animate-blob-morph"></div>
            <div className="absolute inset-2 bg-brand-teal/15 blur-[12px] rounded-full animate-blob-morph" style={{ animationDelay: '1s', animationDirection: 'reverse' }}></div>
            <div
              className="absolute inset-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center transition-all duration-500"
              key={currentStep}
              style={{ animation: 'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <span className="text-3xl">{step.emoji}</span>
            </div>
          </div>

          {/* Step label & detail */}
          <div
            className="mb-6 min-h-[56px] transition-all duration-500"
            key={`text-${currentStep}`}
            style={{ animation: 'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <h3 className="text-xl font-black text-on-surface mb-1 font-display-lg">{step.label}</h3>
            <p className="text-on-surface-variant font-medium text-sm">{step.detail}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm px-6">
            <div className="h-3 bg-surface-variant rounded-full border-2 border-black overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #F97316, #0D9488)',
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-black text-on-surface-variant">{Math.round(progress)}%</span>
              <span className="text-xs font-bold text-on-surface-variant">Step {currentStep + 1} of {GENERATION_STEPS.length}</span>
            </div>
          </div>

          {/* Mini step dots */}
          <div className="flex gap-2 mt-5">
            {GENERATION_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full border-2 border-black transition-all duration-300 ${
                  idx < currentStep
                    ? 'bg-brand-teal scale-100'
                    : idx === currentStep
                    ? 'bg-tripzy-orange scale-125'
                    : 'bg-surface-variant scale-100'
                }`}
              ></div>
            ))}
          </div>

          <p className="text-xs text-on-surface-variant/60 font-medium mt-5 italic">
            AI is generating your personalized itinerary — this usually takes 15-30 seconds
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {concepts.map((concept) => {
            const style = getCardStyle(concept.id);
            return (
              <div
                key={concept.id}
                className={`bento-card ${style.bg} p-6 rounded-2xl border-[3px] border-[#251913] flex flex-col justify-between h-full`}
              >
                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-4xl block mb-2">{style.emoji}</span>
                      <h3 className="font-display-lg text-2xl font-black text-on-surface leading-none">
                        {concept.name}
                      </h3>
                    </div>
                  </div>

                  {/* Vibe */}
                  <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
                    {concept.vibeDescription}
                  </p>

                  {/* Pricing Info */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="font-black text-lg text-on-surface">
                      Est. Total: ₹{concept.estimatedTotalCost.toLocaleString('en-IN')}
                    </span>
                    {getBudgetFitBadge(concept.budgetFit)}
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant/80">Highlights:</h4>
                    <ul className="space-y-2">
                      {concept.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm font-semibold text-on-surface">
                          <span className="text-tripzy-orange mt-0.5">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-8 space-y-4">
                  <div className="bg-white/40 dark:bg-black/5 p-3 rounded-xl border border-[#251913]/10 text-xs font-bold text-on-surface-variant italic">
                    💡 {concept.bestFor}
                  </div>
                  
                  <button
                    onClick={() => onSelect(concept)}
                    className="w-full py-3.5 bg-black text-white hover:bg-brand-teal hover:text-white font-black text-sm rounded-xl border-[3px] border-[#251913] btn-shadow active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all font-display-lg"
                  >
                    Select Concept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
