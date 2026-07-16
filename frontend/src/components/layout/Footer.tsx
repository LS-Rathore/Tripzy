import { Link } from 'react-router-dom';
import logo2 from '../../assets/logo2.png';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-high rounded-t-[32px] mt-12 border-t-[3px] border-[#251913]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="h-12 flex items-center w-fit">
            <img 
              src={logo2} 
              alt="Tripzy Logo" 
              className="h-20 w-auto object-contain my-[-16px] max-w-none" 
            />
          </Link>
          <p className="text-on-surface-variant font-body-md font-medium">
            Adventure awaits. Plan smarter, travel deeper with our AI concierge.
          </p>
          <div className="flex gap-3 mt-2">
            <a
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary-container hover:text-white transition-colors border-[2px] border-[#251913] shadow-[2px_2px_0px_0px_#251913]"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary-container hover:text-white transition-colors border-[2px] border-[#251913] shadow-[2px_2px_0px_0px_#251913]"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <span className="material-symbols-outlined text-xl">photo_camera</span>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary-container hover:text-white transition-colors border-[2px] border-[#251913] shadow-[2px_2px_0px_0px_#251913]"
              href="mailto:hello@tripzy.com"
              aria-label="Email"
            >
              <span className="material-symbols-outlined text-xl">mail</span>
            </a>
          </div>
        </div>

        {/* Explore Column */}
        <div className="flex flex-col gap-4">
          <h5 className="font-bold text-on-surface text-lg">Explore</h5>
          <ul className="flex flex-col gap-3">
            <li>
              <Link className="text-on-surface-variant font-medium hover:text-primary underline underline-offset-4 transition-opacity" to="/plan">
                AI Planner
              </Link>
            </li>
            <li>
              <Link className="text-on-surface-variant font-medium hover:text-primary underline underline-offset-4 transition-opacity" to="/explore">
                Destinations
              </Link>
            </li>
            <li>
              <Link className="text-on-surface-variant font-medium hover:text-primary underline underline-offset-4 transition-opacity" to="/features">
                Features
              </Link>
            </li>
            <li>
              <Link className="text-on-surface-variant font-medium hover:text-primary underline underline-offset-4 transition-opacity" to="/how-it-works">
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        {/* Trust Column */}
        <div className="flex flex-col gap-4">
          <h5 className="font-bold text-on-surface text-lg">Trust</h5>
          <ul className="flex flex-col gap-3">
            <li>
              <a className="text-on-surface-variant font-medium hover:text-primary underline underline-offset-4 transition-opacity" href="#">
                Safety
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant font-medium hover:text-primary underline underline-offset-4 transition-opacity" href="#">
                Support
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant font-medium hover:text-primary underline underline-offset-4 transition-opacity" href="#">
                Terms
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant font-medium hover:text-primary underline underline-offset-4 transition-opacity" href="#">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="flex flex-col gap-4">
          <h5 className="font-bold text-on-surface text-lg">Newsletter</h5>
          <p className="text-label-sm text-on-surface-variant">Get weekly travel tips & hidden gem alerts.</p>
          <div className="flex flex-col gap-3">
            <input
              className="px-4 py-3 rounded-xl border-[3px] border-[#251913] bg-white focus:border-primary-container outline-none transition-all focus:shadow-[4px_4px_0px_0px_#251913] font-medium"
              placeholder="Your email"
              type="email"
            />
            <button className="bg-on-surface text-surface py-3 rounded-xl font-bold border-[3px] border-[#251913] btn-shadow active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all hover:bg-tripzy-orange hover:text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center pb-8 border-t-[3px] border-[#251913] pt-8 px-margin-desktop bg-surface-variant">
        <p className="text-label-sm text-on-surface-variant font-bold">
          © {new Date().getFullYear()} Tripzy. Adventure awaits. 🌍
        </p>
      </div>
    </footer>
  );
}
