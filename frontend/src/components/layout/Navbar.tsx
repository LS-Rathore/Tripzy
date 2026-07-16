import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-40 glass-nav transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-5 max-w-container-max mx-auto">
          <div className="flex items-center gap-10">
            <Link to="/">
              <img alt="Tripzy Logo" className="h-9 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFmvmck7staTZo3fnqI5l0PWRG5XZzUP6Y1ay_r6e5qjkHjADZWvCgF3cNFhzC24es4Mv_dkZ0tcb0Y1-p-soNFbu65Iwf0FA6AF0eqtCThXXkd4kzboj5WbU7vEyf_qi4YUu5dMS9oTxZ32d1LWruRqAB5BV1AlBw8hc1aiaA4bi5cFogS7p299OSlr5R7V2036DpMcACUzxjHp-91clYno7HG0liLGOwDjbu9ZXj4eRS_EdE9u2O1Q" />
            </Link>
            <div className="hidden md:flex gap-8">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tripzy-orange transition-colors font-bold" href="/#how-it-works">How it works</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tripzy-orange transition-colors font-bold" href="/#features">Features</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-tripzy-orange transition-colors font-bold" href="#">My Trips</a>
            </div>
          </div>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="px-6 py-2 rounded-xl border-[3px] border-[#251913] text-[#251913] font-label-sm font-bold hover:bg-tripzy-orange hover:text-white hover:border-tripzy-orange transition-all scale-100 active:scale-95 shadow-[2px_2px_0px_0px_#251913] hover:shadow-none"
          >
            Sign In
          </button>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}
