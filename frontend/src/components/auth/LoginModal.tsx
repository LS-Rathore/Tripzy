import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginWithEmail, signupWithEmail } = useAuth();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(name, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white/95 backdrop-blur-md w-full max-w-sm p-6 md:p-8 border-[3px] border-[#251913] rounded-[24px] shadow-[0px_12px_32px_rgba(41,37,36,0.12)] relative z-10 animate-fade-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-tripzy-orange transition-colors p-1.5 rounded-full hover:bg-surface-variant/30 z-20"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Decorative Floating Icon (placed on the top-left corner) */}
        <div className="absolute -top-6 -left-6 w-14 h-14 bg-tripzy-orange text-white rounded-2xl flex items-center justify-center -rotate-12 shadow-[4px_4px_0px_0px_#251913] border-[3px] border-[#251913] z-20">
          <span className="material-symbols-outlined text-2xl font-bold">flight_takeoff</span>
        </div>

        <div className="text-center mb-6 pt-2">
          <h3 className="text-xl font-black text-on-surface mb-1 font-display-lg">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant font-semibold">
            {mode === 'signin' ? 'Plan, save, and manage your trips.' : 'Join Tripzy to start planning your dream trips.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-400 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Input (Sign Up mode only) */}
          {mode === 'signup' && (
            <div className="space-y-1.5 text-left">
              <label className="font-label-sm text-xs font-bold text-on-surface-variant ml-1 block" htmlFor="modal-name">
                Full Name
              </label>
              <input 
                className="w-full px-4 py-3 rounded-xl bg-white font-body-md font-medium text-on-surface border-[3px] border-[#251913] focus:ring-0 focus:border-tripzy-orange focus:shadow-[3px_3px_0px_0px_#251913] transition-all outline-none text-sm" 
                id="modal-name" 
                placeholder="Alex Explorer" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === 'signup'}
              />
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5 text-left">
            <label className="font-label-sm text-xs font-bold text-on-surface-variant ml-1 block" htmlFor="modal-email">
              Email Address
            </label>
            <input 
              className="w-full px-4 py-3 rounded-xl bg-white font-body-md font-medium text-on-surface border-[3px] border-[#251913] focus:ring-0 focus:border-tripzy-orange focus:shadow-[3px_3px_0px_0px_#251913] transition-all outline-none text-sm" 
              id="modal-email" 
              placeholder="explorer@tripzy.ai" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center px-1">
              <label className="font-label-sm text-xs font-bold text-on-surface-variant" htmlFor="modal-password">
                Password
              </label>
            </div>
            <div className="relative">
              <input 
                className="w-full px-4 py-3 rounded-xl bg-white font-body-md font-medium text-on-surface border-[3px] border-[#251913] focus:ring-0 focus:border-tripzy-orange focus:shadow-[3px_3px_0px_0px_#251913] transition-all outline-none pr-12 text-sm" 
                id="modal-password" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-tripzy-orange p-1" 
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Main Action Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-tripzy-orange text-white font-black text-base rounded-xl border-[3px] border-[#251913] shadow-[4px_4px_0px_0px_#251913] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#251913] active:translate-y-[4px] active:shadow-none transition-all duration-100 mt-2 font-display-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs font-bold text-on-surface-variant hover:text-tripzy-orange transition-colors"
          >
            {mode === 'signin' ? (
              <>Don't have an account? <span className="underline text-tripzy-orange">Sign Up</span></>
            ) : (
              <>Already have an account? <span className="underline text-tripzy-orange">Sign In</span></>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-[2px] flex-1 bg-outline-variant/40 rounded-full"></div>
          <span className="font-label-sm text-[12px] text-on-surface-variant font-bold uppercase tracking-widest">or</span>
          <div className="h-[2px] flex-1 bg-outline-variant/40 rounded-full"></div>
        </div>

        {/* Social Action */}
        <button 
          onClick={login}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-white border-[3px] border-outline-variant/60 rounded-xl hover:bg-tripzy-bg hover:border-[#251913] active:scale-[0.98] transition-all duration-200 group"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
          <span className="font-label-sm font-bold text-on-surface group-hover:text-tripzy-orange transition-colors">Sign in with Google</span>
        </button>

        {/* Legal Footer */}
        <div className="mt-6 text-center">
          <p className="font-label-sm text-[11px] leading-relaxed text-on-surface-variant px-2">
            By continuing, you agree to Tripzy's <br className="hidden sm:block"/>
            <a className="underline font-bold hover:text-tripzy-orange transition-colors" href="#">Terms of Service</a> 
            {" "}and{" "}
            <a className="underline font-bold hover:text-tripzy-orange transition-colors" href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
