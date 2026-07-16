import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate('/');
  };

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
              {user && (
                <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-tripzy-orange transition-colors font-bold" to="/my-trips">My Trips</Link>
              )}
            </div>
          </div>

          {/* Auth Section */}
          {user ? (
            <div className="relative" id="user-dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl border-[2px] border-transparent hover:border-outline-variant transition-all"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-[2px] border-[#251913]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-sm font-bold border-[2px] border-[#251913]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:block font-label-sm font-bold text-on-surface max-w-[120px] truncate">
                  {user.name}
                </span>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  {isDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border-[3px] border-[#251913] rounded-xl shadow-[6px_6px_0px_0px_#251913] overflow-hidden z-50 animate-fade-up">
                  <div className="px-4 py-3 border-b-[2px] border-outline-variant/30">
                    <p className="font-label-sm font-bold text-on-surface truncate">{user.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/my-trips"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-on-surface font-label-sm font-bold hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">luggage</span>
                    My Trips
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-error font-label-sm font-bold hover:bg-error-container/30 transition-colors w-full text-left"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 rounded-xl border-[3px] border-[#251913] text-[#251913] font-label-sm font-bold hover:bg-tripzy-orange hover:text-white hover:border-tripzy-orange transition-all scale-100 active:scale-95 shadow-[2px_2px_0px_0px_#251913] hover:shadow-none"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

