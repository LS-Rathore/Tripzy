import Navbar from '../components/layout/Navbar';

export default function ItineraryPage() {
  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md overflow-x-hidden">
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 text-center">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-tripzy-text mb-6">
          Your AI Itinerary (Coming Soon)
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
          We've received your trip details! In the next phase, this page will display your personalized, AI-generated travel plan.
        </p>
      </main>
    </div>
  );
}
