import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32 bg-gradient-to-b from-surface to-surface-container-low">
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_E18oI5GGywFZ0Bt2JTCrIL7uja8C-dBymoWbCLK9sMM9SFZXJp0dhn45mfLN5lgDREVJhiFGFd6nHwp98ias7_RUcClIuvOGygo4qu36sxR_R1x3rrcu7HDrFrQc6tzj8pORT8xei-0_ehRFA4bVq1khUyCMgjT70GN337gpInb470Qo0a7DrW3NRbSa7fpYq4H0EIiBYaOsbjs5cx_n4PxkXR58UlsSnY8W61UAqrUpS6ZFERbPjQ")', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)' }}></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 gap-12 items-center">
          <div className="z-10 text-center">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 leading-tight">
              Plan your perfect India trip in seconds
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
              Tripzy builds real, budget-aware itineraries with hidden local gems — like advice from a friend who actually lives there.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/plan" className="px-8 py-4 bg-primary-container text-on-primary-fixed-variant rounded-full font-headline-md text-headline-md hover:shadow-lg transition-all scale-100 hover:scale-105 active:scale-95 text-center">
                Plan My Trip
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Why Tripzy Strip */}
      <section className="py-24 bg-[#F0F9F9]" id="features">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-teal text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-4xl">psychology</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">AI-Powered Itineraries</h3>
              <p className="text-on-surface-variant font-body-md">Optimized routes that maximize your time and hit every must-see landmark without the burnout.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-teal text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-4xl">local_activity</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Real Local Spots</h3>
              <p className="text-on-surface-variant font-body-md">Skip the tourist traps. We find the authentic cafes and quiet corners locals love.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-brand-teal text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-4xl">savings</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Budget-Aware Planning</h3>
              <p className="text-on-surface-variant font-body-md">Real-time estimations based on your daily spending limit, covering stays, food, and transport.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden" id="how-it-works">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-center text-on-surface mb-20">Your Trip in 3 Easy Steps</h2>
          <div className="relative flex flex-col md:flex-row justify-between gap-12">
            <div className="flex-1 relative z-10 text-center flex flex-col items-center">
              <div className="step-line w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center font-headline-md text-headline-md mb-6 ambient-shadow">1</div>
              <h4 className="font-headline-md text-headline-md mb-4 text-on-surface">Tell us your vibes</h4>
              <p className="text-on-surface-variant">Enter your destination, dates, and budget. Choose your travel style.</p>
            </div>
            <div className="flex-1 relative z-10 text-center flex flex-col items-center">
              <div className="step-line w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center font-headline-md text-headline-md mb-6 ambient-shadow">2</div>
              <h4 className="font-headline-md text-headline-md mb-4 text-on-surface">Tripzy builds it</h4>
              <p className="text-on-surface-variant">Our AI cross-references local data to create a custom map-based plan.</p>
            </div>
            <div className="flex-1 relative z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center font-headline-md text-headline-md mb-6 ambient-shadow">3</div>
              <h4 className="font-headline-md text-headline-md mb-4 text-on-surface">Refine and go</h4>
              <p className="text-on-surface-variant">Swap spots, book stays directly, and share the itinerary with friends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-12 bg-surface-container border-y border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Trusted for trips across India</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="font-headline-md text-headline-md font-bold">DELHI</span>
            <span className="font-headline-md text-headline-md font-bold text-secondary">JAIPUR</span>
            <span className="font-headline-md text-headline-md font-bold">GOA</span>
            <span className="font-headline-md text-headline-md font-bold text-secondary">MUMBAI</span>
            <span className="font-headline-md text-headline-md font-bold">RISHIKESH</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-margin-mobile">
        <div className="max-w-container-max mx-auto rounded-3xl bg-primary-container p-12 md:p-20 text-center relative overflow-hidden elevated-shadow">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <span className="material-symbols-outlined text-9xl">flight_takeoff</span>
          </div>
          <div className="relative z-10">
            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-6">Your next trip is one click away</h2>
            <p className="font-body-lg text-body-lg text-white/90 mb-12 max-w-2xl mx-auto">Join 10,000+ travelers exploring India the smart way. No more spreadsheets, just pure adventure.</p>
            <Link to="/plan" className="inline-block px-12 py-5 bg-white text-primary font-headline-md text-headline-md rounded-full shadow-xl hover:shadow-2xl transition-all scale-100 hover:scale-105 active:scale-95">
              Start Planning Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface py-16 border-t border-surface-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="space-y-4">
              <img alt="Tripzy Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFmvmck7staTZo3fnqI5l0PWRG5XZzUP6Y1ay_r6e5qjkHjADZWvCgF3cNFhzC24es4Mv_dkZ0tcb0Y1-p-soNFbu65Iwf0FA6AF0eqtCThXXkd4kzboj5WbU7vEyf_qi4YUu5dMS9oTxZ32d1LWruRqAB5BV1AlBw8hc1aiaA4bi5cFogS7p299OSlr5R7V2036DpMcACUzxjHp-91clYno7HG0liLGOwDjbu9ZXj4eRS_EdE9u2O1Q" />
              <p className="text-on-surface-variant font-body-md max-w-xs">Intelligent itineraries for the modern explorer. Experience the real India, effortlessly.</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">About Us</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-surface-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-on-surface-variant font-label-sm text-label-sm">© 2026 Tripzy AI. Discover India, intelligently.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-white transition-all" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-white transition-all" href="#"><span className="material-symbols-outlined">share</span></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
