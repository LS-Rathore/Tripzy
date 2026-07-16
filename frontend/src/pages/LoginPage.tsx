import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
        <div className="bg-white/95 backdrop-blur-md w-full max-w-md p-8 md:p-10 border-[3px] border-[#251913] rounded-[24px] shadow-[0px_12px_32px_rgba(41,37,36,0.12)] relative animate-fade-up">
          {/* Decorative Floating Icon */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-tripzy-orange text-white rounded-2xl flex items-center justify-center rotate-12 shadow-[0px_8px_16px_rgba(249,115,22,0.3)] hidden md:flex border-[3px] border-[#251913]">
            <span className="material-symbols-outlined text-3xl font-bold">flight_takeoff</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-on-surface mb-2 font-display-lg">
              Welcome to Tripzy!
            </h1>
            <p className="font-body-md text-on-surface-variant font-medium">
              Sign in to plan, save, and manage your trips.
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border-[3px] border-[#251913] rounded-xl shadow-[4px_4px_0px_0px_#251913] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#251913] active:translate-y-[4px] active:shadow-none transition-all duration-100 group"
          >
            <img
              alt="Google Logo"
              height="20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYVF16dkw_IJYiOZqL0PC6szUxEyq3UZvTwDcvFOcGrr9XvgjJBcS1mXBRzBvuVDh-5JTdcAhBSqnPAInqKJvbt5E5ZeOOaeL3nQRp5e1FDjxTooMMhVX6J7Y-2UujP1dH1G0R_MyKXJIiPvMM9mrcpL5orbDl8zU0DAuAt2MHFlkfNXo0RGn4s9ot4CymGsvyur_AIzQbQRGfgo9-g-vpQSdL4bF_pmRTpvzl77nivXwAWhN43OoUGQ"
              width="20"
            />
            <span className="font-label-sm font-bold text-on-surface group-hover:text-tripzy-orange transition-colors">
              Sign in with Google
            </span>
          </button>

          {/* Legal Footer */}
          <div className="mt-8 text-center">
            <p className="font-label-sm text-[12px] leading-relaxed text-on-surface-variant px-4">
              By continuing, you agree to Tripzy's <br className="hidden sm:block" />
              <a className="underline font-bold hover:text-tripzy-orange transition-colors" href="#">
                Terms of Service
              </a>{' '}
              and{' '}
              <a className="underline font-bold hover:text-tripzy-orange transition-colors" href="#">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
