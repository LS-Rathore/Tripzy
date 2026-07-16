import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30"></div>
      
      <Navbar />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 py-10 relative z-10">
        <div className="bento-card bg-white p-6 md:p-8 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="inline-block bg-brand-teal text-white font-black px-3 py-1 rounded-lg transform -rotate-2 w-max shadow-md mb-4 text-xs uppercase tracking-wide">
            Help Center
          </div>
          
          <h1 className="font-display-lg text-3xl md:text-4xl font-black text-on-surface mb-4 leading-tight tracking-tight">
            How can we help?
          </h1>
          <p className="text-on-surface-variant font-medium text-base mb-6">
            Having trouble planning your trip? We're here to make things right.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 border-[3px] border-black rounded-2xl bg-surface-variant hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-tripzy-orange mb-4">mail</span>
              <h3 className="font-display-lg text-xl font-black mb-2">Email Support</h3>
              <p className="text-on-surface-variant mb-4">Drop us a line and we'll get back to you within 24 hours.</p>
              <a href="mailto:support@tripzy.com" className="font-bold text-tripzy-orange hover:underline">support@tripzy.com</a>
            </div>
            
            <div className="p-6 border-[3px] border-black rounded-2xl bg-surface-variant hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-brand-teal mb-4">chat</span>
              <h3 className="font-display-lg text-xl font-black mb-2">Live Chat</h3>
              <p className="text-on-surface-variant mb-4">Chat with our team directly from the app (coming soon).</p>
              <button className="font-bold text-brand-teal opacity-50 cursor-not-allowed">Unavailable</button>
            </div>
          </div>

          <h2 className="font-display-lg text-2xl font-black text-on-surface mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-[2px] border-black rounded-xl p-4 bg-white">
              <h4 className="font-bold text-lg mb-2">How accurate is the AI planner?</h4>
              <p className="text-on-surface-variant">Our AI uses curated data to suggest realistic itineraries, but travel times can vary in India. Always double-check major transit timings.</p>
            </div>
            <div className="border-[2px] border-black rounded-xl p-4 bg-white">
              <h4 className="font-bold text-lg mb-2">Can I edit my itinerary later?</h4>
              <p className="text-on-surface-variant">Yes! You can view and delete trips in your "My Trips" dashboard. Full editing capabilities are rolling out soon.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
