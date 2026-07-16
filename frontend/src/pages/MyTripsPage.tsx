import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function MyTripsPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="text-center">
          <h1 className="font-display-lg text-4xl md:text-5xl font-black text-on-surface mb-4 tracking-tight">
            My Trips
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-12 font-medium">
            All your saved itineraries in one place. This feature is coming soon!
          </p>

          <div className="bento-card bg-white p-12 rounded-2xl max-w-lg mx-auto">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              luggage
            </span>
            <h2 className="font-headline-md text-xl font-bold text-on-surface mb-3">No trips yet</h2>
            <p className="text-on-surface-variant font-medium mb-8">
              Start planning your first adventure and it will show up here.
            </p>
            <Link
              to="/plan"
              className="inline-block bg-primary-container text-white px-8 py-4 rounded-xl font-bold text-lg btn-shadow border-[3px] border-[#251913] hover:bg-primary transition-all"
            >
              Plan a Trip 🏔️
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
