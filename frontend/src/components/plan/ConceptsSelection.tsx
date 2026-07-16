import type { TripConcept } from '../../types/Trip';

export interface ConceptsSelectionProps {
  concepts: TripConcept[];
  onSelect: (concept: TripConcept) => void;
  onBack: () => void;
  saving: boolean;
}

export default function ConceptsSelection({ concepts, onSelect, onBack, saving }: ConceptsSelectionProps) {
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
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border-[3px] border-black staggered-shadow">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-tripzy-orange/20 blur-[15px] rounded-full animate-blob-morph"></div>
            <div className="absolute inset-2 bg-brand-teal/20 blur-[10px] rounded-full animate-blob-morph" style={{ animationDelay: '1s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-tripzy-orange animate-spin">sync</span>
            </div>
          </div>
          <h3 className="text-xl font-black text-on-surface mb-2 font-display-lg">Locking in your vibe...</h3>
          <p className="text-on-surface-variant font-medium text-sm">Saving your trip & building your custom route.</p>
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
