import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white/95 backdrop-blur-md w-full max-w-md p-8 md:p-10 border-[3px] border-[#251913] rounded-[24px] shadow-[0px_12px_32px_rgba(41,37,36,0.12)] relative z-10 animate-fade-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-tripzy-orange transition-colors p-2 rounded-full hover:bg-surface-variant/30"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Decorative Floating Icon (hidden on small screens, maybe keep it inside or attached to border) */}
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-tripzy-orange text-white rounded-2xl flex items-center justify-center rotate-12 shadow-[0px_8px_16px_rgba(249,115,22,0.3)] hidden md:flex border-[3px] border-[#251913]">
          <span className="material-symbols-outlined text-3xl font-bold">flight_takeoff</span>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-on-surface mb-2 font-display-lg">
            Sign In
          </h3>
          <p className="font-body-md text-on-surface-variant font-medium">
            Plan, save, and manage your trips.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Email Input */}
          <div className="space-y-2 text-left">
            <label className="font-label-sm text-sm font-bold text-on-surface-variant ml-1 block" htmlFor="email">Email Address</label>
            <input 
              className="w-full px-4 py-4 rounded-xl bg-white font-body-md font-medium text-on-surface border-[3px] border-[#251913] focus:ring-0 focus:border-tripzy-orange focus:shadow-[4px_4px_0px_0px_#251913] transition-all outline-none" 
              id="email" 
              placeholder="explorer@tripzy.ai" 
              type="email"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center px-1">
              <label className="font-label-sm text-sm font-bold text-on-surface-variant" htmlFor="password">Password</label>
              <a className="text-[12px] font-label-sm text-tripzy-orange font-bold hover:underline" href="#">Forgot?</a>
            </div>
            <div className="relative">
              <input 
                className="w-full px-4 py-4 rounded-xl bg-white font-body-md font-medium text-on-surface border-[3px] border-[#251913] focus:ring-0 focus:border-tripzy-orange focus:shadow-[4px_4px_0px_0px_#251913] transition-all outline-none pr-12" 
                id="password" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-tripzy-orange p-1" 
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Main Action Button */}
          <button className="w-full py-4 px-6 bg-tripzy-orange text-white font-black text-lg rounded-xl border-[3px] border-[#251913] shadow-[4px_4px_0px_0px_#251913] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#251913] active:translate-y-[4px] active:shadow-none transition-all duration-100 mt-2 font-display-lg tracking-wide">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-[2px] flex-1 bg-outline-variant/40 rounded-full"></div>
          <span className="font-label-sm text-[12px] text-on-surface-variant font-bold uppercase tracking-widest">or</span>
          <div className="h-[2px] flex-1 bg-outline-variant/40 rounded-full"></div>
        </div>

        {/* Social Action */}
        <button 
          onClick={login}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border-[3px] border-outline-variant/60 rounded-xl hover:bg-tripzy-bg hover:border-[#251913] active:scale-[0.98] transition-all duration-200 group"
        >
          <img alt="Google Logo" height="20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYVF16dkw_IJYiOZqL0PC6szUxEyq3UZvTwDcvFOcGrr9XvgjJBcS1mXBRzBvuVDh-5JTdcAhBSqnPAInqKJvbt5E5ZeOOaeL3nQRp5e1FDjxTooMMhVX6J7Y-2UujP1dH1G0R_MyKXJIiPvMM9mrcpL5orbDl8zU0DAuAt2MHFlkfNXo0RGn4s9ot4CymGsvyur_AIzQbQRGfgo9-g-vpQSdL4bF_pmRTpvzl77nivXwAWhN43OoUGQ" width="20"/>
          <span className="font-label-sm font-bold text-on-surface group-hover:text-tripzy-orange transition-colors">Sign in with Google</span>
        </button>

        {/* Legal Footer */}
        <div className="mt-8 text-center">
          <p className="font-label-sm text-[12px] leading-relaxed text-on-surface-variant px-4">
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
