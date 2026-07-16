import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function FeaturesPage() {
  const features = [
    {
      icon: "neurology",
      title: "AI-Powered Concepts",
      description: "Get 3 unique trip concepts tailored to your vibe — Relaxed, Balanced, or Packed Adventurer. You pick the direction.",
      color: "bg-tripzy-orange",
      tag: "Core"
    },
    {
      icon: "calendar_month",
      title: "Day-by-Day Itinerary",
      description: "Full schedule with morning, afternoon, evening activities plus breakfast, lunch, and dinner — all with real costs.",
      color: "bg-secondary",
      tag: "Core"
    },
    {
      icon: "swap_horiz",
      title: "Swap Any Option",
      description: "Don't like a restaurant? Tap to swap between 2–3 alternatives for every single slot. Your trip, your rules.",
      color: "bg-tertiary",
      tag: "Interactive"
    },
    {
      icon: "map",
      title: "Map Timeline View",
      description: "See your full day plotted on a live interactive map with numbered pins and a route line connecting each stop.",
      color: "bg-error",
      tag: "Visual"
    },
    {
      icon: "account_balance_wallet",
      title: "Live Cost Tracker",
      description: "Watch your daily and total budget update in real-time as you swap options. No surprises at checkout.",
      color: "bg-brand-teal",
      tag: "Smart"
    },
    {
      icon: "backup",
      title: "Dual AI Fallback",
      description: "Powered by Google Gemini with automatic Groq Llama 3 failover. Your itinerary generates no matter what.",
      color: "bg-primary-container",
      tag: "Reliability"
    },
    {
      icon: "bookmark",
      title: "Save & Manage Trips",
      description: "All your generated trips are saved to your account. Revisit, compare, or delete them anytime from your dashboard.",
      color: "bg-secondary-container",
      tag: "Dashboard"
    },
    {
      icon: "lock",
      title: "Google Sign-In",
      description: "One-tap Google OAuth login. No passwords to remember, no forms to fill. Your trips are tied to your Google account.",
      color: "bg-tertiary-container",
      tag: "Security"
    }
  ];

  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] -z-10 animate-blob-morph"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tripzy-orange/10 rounded-full blur-[150px] -z-10 animate-blob-morph" style={{ animationDelay: '2s' }}></div>

      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 md:px-10 py-10 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-up">
          <div className="inline-block bg-tripzy-orange text-white font-black px-3 py-0.5 rounded-lg transform rotate-2 w-max shadow-lg mb-4 text-xs uppercase tracking-wide">
            Built Different
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-black text-on-surface mb-3 leading-tight tracking-tight">
            Everything You Need,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tripzy-orange to-orange-400">Nothing You Don't</span>
          </h1>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant font-medium leading-relaxed">
            Tripzy packs serious firepower under a clean, simple interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="bento-card bg-white p-5 rounded-2xl border-[3px] border-[#251913] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-fade-up flex flex-col group hover:-translate-y-1 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`${feature.color} w-10 h-10 rounded-xl flex items-center justify-center border-[2px] border-[#251913] group-hover:scale-110 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-lg text-white">
                    {feature.icon}
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-full">
                  {feature.tag}
                </span>
              </div>
              
              <h3 className="text-lg font-black font-display-lg text-on-surface mb-1.5">
                {feature.title}
              </h3>
              <p className="text-on-surface-variant font-medium text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="bento-card bg-primary-container p-8 rounded-2xl border-[3px] border-[#251913] staggered-shadow max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-2 font-display-lg">
              Convinced yet? 😏
            </h2>
            <p className="text-on-surface-variant font-medium text-sm mb-6 max-w-md mx-auto">
              Try it out — plan your first trip in under 60 seconds. No credit card, no commitment.
            </p>
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 bg-tripzy-orange text-white px-6 py-3 rounded-xl font-black text-base btn-shadow border-[3px] border-[#251913] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#251913] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
              Start Planning
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
