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
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
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
