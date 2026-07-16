import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function HowItWorksPage() {
  const steps = [
    {
      id: "01",
      icon: "travel_explore",
      title: "Tell Us Your Vibe",
      description: "Drop in your destination, budget, and what makes you tick. Whether you're a luxury lounger or a budget backpacker, we adapt to you.",
      color: "bg-tripzy-orange",
      rotation: "-rotate-2"
    },
    {
      id: "02",
      icon: "neurology",
      title: "AI Brainstorming",
      description: "Our AI travel agent instantly cooks up 3 distinct trip concepts based on your style. You choose the direction that feels right.",
      color: "bg-secondary",
      rotation: "rotate-2"
    },
    {
      id: "03",
      icon: "calendar_month",
      title: "Get The Itinerary",
      description: "Boom! A full day-by-day plan with exact times, costs, and backup options. It’s like having a local best friend plan your whole trip.",
      color: "bg-tertiary",
      rotation: "-rotate-1"
    },
    {
      id: "04",
      icon: "map",
      title: "Map & Modify",
      description: "View your entire trip on a live interactive map. Easily swap out restaurants or activities if you change your mind on the fly.",
      color: "bg-error",
      rotation: "rotate-3"
    }
  ];

  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30"></div>
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-tripzy-orange/10 rounded-full blur-[120px] -z-10 animate-blob-morph"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-teal/10 rounded-full blur-[150px] -z-10 animate-blob-morph" style={{ animationDelay: '2s' }}></div>

      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 md:px-10 py-10 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-up">
          <div className="inline-block bg-black text-white font-black px-3 py-0.5 rounded-lg transform -rotate-2 w-max shadow-lg mb-4 text-xs uppercase tracking-wide">
            The Magic Behind The Scenes
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-black text-on-surface mb-3 leading-tight tracking-tight">
            How Tripzy{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tripzy-orange to-orange-400">Works</span>
          </h1>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant font-medium leading-relaxed">
            Planning a trip shouldn't require 15 open tabs and a spreadsheet. 
            Here's how we build your perfect itinerary in seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto relative">
          
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`bento-card bg-white p-5 md:p-6 rounded-2xl border-[3px] border-[#251913] staggered-shadow animate-fade-up flex flex-col group hover:-translate-y-1 transition-transform duration-300 z-10 transform ${step.rotation}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${step.color} w-11 h-11 rounded-xl flex items-center justify-center border-[2px] border-[#251913] btn-shadow group-hover:scale-110 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-xl text-white">
                    {step.icon}
                  </span>
                </div>
                <div className="text-3xl font-black text-outline-variant opacity-20 font-display-lg">
                  {step.id}
                </div>
              </div>
              
              <h3 className="text-xl font-black font-display-lg text-on-surface mb-2">
                {step.title}
              </h3>
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="bento-card bg-primary-container p-8 rounded-2xl border-[3px] border-[#251913] staggered-shadow max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-2 font-display-lg">
              Ready to see it in action?
            </h2>
            <p className="text-on-surface-variant font-medium text-sm mb-6 max-w-md mx-auto">
              Stop stressing over the details and start packing. Your next great adventure is just a few clicks away.
            </p>
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 bg-tripzy-orange text-white px-6 py-3 rounded-xl font-black text-base btn-shadow border-[3px] border-[#251913] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#251913] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-lg">flight_takeoff</span>
              Plan a Trip Now
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
