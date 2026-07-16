import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import PlanTripForm from '../components/plan/PlanTripForm';

export default function PlanTripPage() {
  const [stepTwoActive, setStepTwoActive] = useState(false);

  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-x-hidden">
      
      {/* Playful Background Elements */}
      <div className="fixed inset-0 bg-pattern -z-10"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tripzy-orange/10 rounded-full blur-[120px] -z-10 animate-blob-morph"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-teal/10 rounded-full blur-[150px] -z-10 animate-blob-morph" style={{ animationDelay: '2s' }}></div>

      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 animate-fade-up">
        
        {/* Left Column: High Energy Intro (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:mt-[-50px]">
          <div className="inline-block bg-tripzy-orange text-white font-black px-4 py-1 rounded-lg transform -rotate-2 w-max shadow-lg mb-2 text-sm uppercase tracking-wide">
            It's Vacay Time!
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-black text-on-surface leading-[1.05] tracking-tight font-display-lg">
            Let's plan your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tripzy-orange to-orange-400">Dream Trip!</span>
          </h1>
          <p className="text-lg md:text-xl font-semibold text-on-surface-variant max-w-md leading-relaxed font-body-lg">
            Ready for the ultimate adventure? Tell us what moves you and let's build something epic! 🚀
          </p>

          {/* Staggered Progress Steps */}
          <div className="space-y-6 pt-4 hidden sm:block">
            <div className={`flex items-center gap-6 p-4 rounded-2xl w-full md:w-[90%] transition-transform duration-500 cursor-default ${stepTwoActive ? 'bg-white/50 border-2 border-dashed border-outline-variant opacity-60' : 'bg-white shadow-xl bouncy-hover'}`}>
              <div className={`w-14 h-14 min-w-[56px] rounded-2xl flex items-center justify-center text-2xl font-black transition-colors duration-500 ${stepTwoActive ? 'bg-surface-variant text-on-surface-variant' : 'bg-tripzy-orange text-white shadow-lg shadow-tripzy-orange/30'}`}>
                {stepTwoActive ? <span className="material-symbols-outlined text-3xl">check</span> : '01'}
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-sm uppercase tracking-wider ${stepTwoActive ? 'text-on-surface-variant' : 'text-tripzy-orange'}`}>Step One</span>
                <span className="text-xl font-extrabold font-headline-md text-on-surface">Trip Details!</span>
              </div>
            </div>
            
            <div className={`flex items-center gap-6 p-4 rounded-2xl w-full md:w-[90%] translate-x-6 cursor-default transition-all duration-500 ${stepTwoActive ? 'bg-white shadow-xl bouncy-hover border-none' : 'bg-white/50 border-2 border-dashed border-outline-variant'}`}>
              <div className={`w-14 h-14 min-w-[56px] rounded-2xl flex items-center justify-center text-2xl font-black transition-colors duration-500 ${stepTwoActive ? 'bg-tripzy-orange text-white shadow-lg shadow-tripzy-orange/30' : 'bg-surface-variant text-on-surface-variant'}`}>02</div>
              <div className={`flex flex-col transition-opacity duration-500 ${stepTwoActive ? 'opacity-100' : 'opacity-60'}`}>
                <span className={`font-black text-sm uppercase tracking-wider ${stepTwoActive ? 'text-tripzy-orange' : 'text-on-surface-variant'}`}>
                  {stepTwoActive ? 'Step Two' : 'Coming Up'}
                </span>
                <span className="text-xl font-extrabold font-headline-md text-on-surface">Pick Your Vibes!</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Form (7 Cols) */}
        <section className="lg:col-span-7 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white p-6 md:p-8 rounded-2xl border-[3px] border-black staggered-shadow relative z-20">
            <PlanTripForm onTopHalfComplete={setStepTwoActive} />
          </div>
        </section>

      </main>
    </div>
  );
}
