import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

interface TripSummary {
  id: string;
  city: string;
  numberOfDays: number;
  conceptName: string;
  createdAt: string;
}

export default function MyTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTrips = async () => {
      try {
        const res = await fetch(`${API_URL}/api/trips`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await res.json();
        setTrips(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user, API_URL]);

  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-hidden">
      
      {/* Playful Background Elements */}
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30"></div>
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-tripzy-orange/10 rounded-full blur-[120px] -z-10 animate-blob-morph"></div>

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10 animate-fade-up">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <h1 className="font-display-lg text-4xl md:text-5xl font-black text-on-surface mb-2 tracking-tight">
              My Trips
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant font-medium">
              All your saved adventures in one place.
            </p>
          </div>
          <Link
            to="/plan"
            className="inline-flex items-center justify-center bg-tripzy-orange text-white px-6 py-3 rounded-xl font-bold text-sm btn-shadow border-[3px] border-[#251913] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#251913] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Plan a New Trip
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-[4px] border-outline-variant border-t-tripzy-orange rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-100 border-2 border-red-400 rounded-2xl text-red-700 font-bold max-w-lg mx-auto">
            {error}
          </div>
        ) : !user ? (
          <div className="bento-card bg-white p-12 rounded-2xl max-w-lg mx-auto text-center border-[3px] border-[#251913] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 block">lock</span>
            <h2 className="font-headline-md text-2xl font-black text-on-surface mb-3">Login Required</h2>
            <p className="text-on-surface-variant font-medium mb-8">Please log in to view your saved trips.</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="bento-card bg-white p-12 rounded-2xl max-w-lg mx-auto text-center border-[3px] border-[#251913] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              luggage
            </span>
            <h2 className="font-headline-md text-2xl font-black text-on-surface mb-3">No trips yet</h2>
            <p className="text-on-surface-variant font-medium mb-8">
              Start planning your first adventure and it will show up here.
            </p>
            <Link
              to="/plan"
              className="inline-block bg-tripzy-orange text-white px-8 py-4 rounded-xl font-bold text-lg btn-shadow border-[3px] border-[#251913] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#251913] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Plan a Trip 🏔️
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bento-card bg-white p-6 rounded-2xl border-[3px] border-black flex flex-col hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-tripzy-orange/20 text-tripzy-orange font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                    {trip.numberOfDays} Days
                  </div>
                  <span className="text-xs text-on-surface-variant font-bold">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-2xl font-black font-display-lg text-on-surface mb-1 line-clamp-1">{trip.city}</h3>
                <p className="text-on-surface-variant font-medium text-sm mb-6 line-clamp-2">
                  {trip.conceptName || 'Trip Concept'}
                </p>
                <div className="mt-auto pt-4 border-t-2 border-outline-variant flex justify-end">
                  <Link
                    to={`/itinerary/${trip.id}`}
                    className="flex items-center gap-2 text-tripzy-orange font-bold group"
                  >
                    View Itinerary 
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
