import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30"></div>
      
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-10 py-16 relative z-10">
        <div className="bento-card bg-white p-8 md:p-12 rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="inline-block bg-tripzy-orange text-white font-black px-3 py-1 rounded-lg transform -rotate-2 w-max shadow-lg mb-6 text-sm uppercase tracking-wide">
            Our Story
          </div>
          
          <h1 className="font-display-lg text-4xl md:text-5xl font-black text-on-surface mb-8 leading-tight tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-tripzy-orange to-orange-400">Tripzy</span>
          </h1>
          
          <div className="space-y-6 text-on-surface-variant font-medium text-lg leading-relaxed">
            <p>
              Tripzy was born out of a simple frustration: planning travel in India is incredibly complex, but it shouldn't be. Between dozens of tabs, outdated blogs, and generic travel packages, the joy of travel was getting lost in the logistics.
            </p>
            <p>
              We believe that every traveler deserves a hyper-personalized itinerary that matches their exact vibe—whether that's finding the quietest Himalayan peak, the most vibrant Goan shack, or the perfect balance of heritage and relaxation.
            </p>
            <p>
              Powered by advanced AI and a deep love for India's diverse landscapes, Tripzy acts as your personal travel concierge. We do the heavy lifting of researching, organizing, and plotting out your days so you can focus on what matters most: the adventure.
            </p>
            
            <div className="mt-12 pt-8 border-t-[3px] border-black/10">
              <h2 className="font-display-lg text-2xl font-black text-on-surface mb-4">Our Mission</h2>
              <p>
                To make exploring India effortless, deeply personal, and endlessly exciting.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
