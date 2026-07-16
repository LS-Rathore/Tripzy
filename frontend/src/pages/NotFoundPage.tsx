import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex items-center justify-center px-margin-mobile">
      <div className="text-center">
        <h1 className="font-display-lg text-[120px] md:text-[180px] font-black text-primary-container leading-none tracking-tighter mb-4">
          404
        </h1>
        <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-4">
          Page not found
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-10 font-medium">
          Looks like you've wandered off the trail. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary-container text-white px-8 py-4 rounded-xl font-bold text-lg btn-shadow border-[3px] border-[#251913] hover:bg-primary transition-all"
        >
          Back to Home 🏠
        </Link>
      </div>
    </div>
  );
}
