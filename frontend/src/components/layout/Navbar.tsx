import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import logo2 from '../../assets/logo2.png';

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
      <nav className={`sticky top-0 z-40 bg-tripzy-bg border-b-[3px] border-[#251913] transition-all py-4 ${isScrolled ? 'shadow-md py-3' : ''}`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="h-12 flex items-center">
              <img 
                src={logo2} 
                alt="Tripzy Logo" 
                className="h-20 w-auto object-contain my-[-16px] max-w-none" 
              />
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-6">
              <a className="font-label-sm text-sm text-on-surface-variant hover:text-tripzy-orange hover:bg-tripzy-orange/10 px-3 py-1.5 rounded-lg transition-all font-bold" href="/#how-it-works">How it works</a>
              <a className="font-label-sm text-sm text-on-surface-variant hover:text-tripzy-orange hover:bg-tripzy-orange/10 px-3 py-1.5 rounded-lg transition-all font-bold" href="/#features">Features</a>
              <a className="font-label-sm text-sm text-on-surface-variant hover:text-tripzy-orange hover:bg-tripzy-orange/10 px-3 py-1.5 rounded-lg transition-all font-bold" href="/#explore">Explore</a>
              {user && (
                <Link className="font-label-sm text-sm text-on-surface-variant hover:text-tripzy-orange hover:bg-tripzy-orange/10 px-3 py-1.5 rounded-lg transition-all font-bold" to="/my-trips">My Trips</Link>
              )}
            </div>
          </div>

          {/* Auth & CTA Section */}
          <div className="flex items-center gap-4">
            <Link 
              to="/plan"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border-[3px] border-[#251913] bg-tripzy-orange text-white font-black text-sm shadow-[2px_2px_0px_0px_#251913] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#251913] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <span>Plan Trip</span>
              <span className="material-symbols-outlined text-sm font-bold">explore</span>
            </Link>

            {user ? (
              <div className="relative" id="user-dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl border-[3px] border-[#251913] bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-tripzy-orange/10 active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-[#251913]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-sm font-bold border-2 border-[#251913]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block font-label-sm font-black text-on-surface max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">
                    {isDropdownOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-4 w-52 bg-white border-[3px] border-[#251913] rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50 animate-fade-up">
                    <div className="px-4 py-3 border-b-[2px] border-[#251913]/10 bg-tripzy-bg">
                      <p className="font-label-sm font-black text-on-surface truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant font-medium truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-trips"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-on-surface font-label-sm font-bold hover:bg-tripzy-orange/10 hover:text-tripzy-orange transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">luggage</span>
                      My Trips
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-error font-label-sm font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors w-full text-left"
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
                className="px-6 py-2.5 rounded-xl border-[3px] border-[#251913] bg-white text-on-surface font-black text-sm btn-shadow active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all hover:bg-tripzy-orange hover:text-white"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

