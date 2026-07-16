import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden selection:bg-primary-container selection:text-white min-h-screen flex flex-col">
      {/* Watermark Backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="watermark-text font-black absolute -top-10 -left-20 rotate-12">Tripzy!</div>
        <div className="watermark-text font-black absolute top-1/2 -right-20 -rotate-12">Tripzy!</div>
        <div className="watermark-text font-black absolute -bottom-10 left-1/3 rotate-6">Tripzy!</div>
      </div>

      {/* TopNavBar */}
      <Navbar />

      <main className="relative flex-1">
        {/* Hero Section */}
        <section className="relative px-margin-mobile md:px-margin-desktop pt-12 pb-16 max-w-container-max mx-auto text-center">

          <h1 className="font-display-lg text-display-lg md:text-6xl leading-[0.9] font-black text-on-surface mb-8 tracking-tighter">
            Let's plan your <br /> <span className="text-primary-container italic">Dream Trip!</span>
          </h1>
          <p className="max-w-2xl mx-auto font-body-lg text-body-lg text-on-surface-variant mb-12 font-medium">
            Say goodbye to generic travel guides. Get a hyper-personalized India itinerary powered by AI that knows the hidden chai stalls and the best sunset peaks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/plan" className="bg-primary-container text-white px-10 py-5 rounded-xl font-bold text-lg btn-shadow flex items-center gap-2 hover:bg-primary transition-all border-[3px] border-[#251913]">
              Start Planning 🏔️
            </Link>
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute top-[15%] left-2 md:left-12 xl:left-24 hidden sm:block">
            <div className="bento-card bg-white p-4 rotate-12 rounded-xl">
              <span className="text-3xl">🛕</span>
            </div>
          </div>
          <div className="absolute bottom-[15%] left-6 md:left-20 xl:left-32 hidden sm:block">
            <div className="bento-card bg-white p-4 -rotate-12 rounded-xl">
              <span className="text-3xl">🛺</span>
            </div>
          </div>
          
          <div className="absolute top-[20%] right-6 md:right-20 xl:right-32 hidden sm:block">
            <div className="bento-card bg-white p-4 rotate-6 rounded-xl">
              <span className="text-3xl">🦚</span>
            </div>
          </div>
          <div className="absolute bottom-[15%] right-2 md:right-12 xl:right-24 hidden sm:block">
            <div className="bento-card bg-white p-4 -rotate-6 rounded-xl">
              <span className="text-3xl"> 🪷 </span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface-container-low py-16 px-margin-mobile md:px-margin-desktop border-y-[3px] border-[#251913]">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
              <div className="max-w-xl">
                <h2 className="font-headline-md text-headline-md font-black text-on-surface mb-4">Why Tripzy? ✨</h2>
                <p className="text-on-surface-variant font-body-md font-medium">We've blended local Indian hospitality with state-of-the-art intelligence to build the ultimate explorer's tool.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="bento-card bg-white p-8 rounded-2xl flex flex-col items-start gap-6 group">
                <div className="w-16 h-16 bg-primary-container/10 flex items-center justify-center rounded-2xl text-primary-container group-hover:scale-110 transition-transform border-[2px] border-primary-container">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold">AI-Powered Itineraries</h3>
                <p className="text-on-surface-variant font-medium">Our AI analyzes millions of data points to create routes that actually make sense for your pace and preferences.</p>
              </div>

              {/* Feature 2 */}
              <div className="bento-card bg-secondary-container p-8 rounded-2xl flex flex-col items-start gap-6 group">
                <div className="w-16 h-16 bg-white/50 flex items-center justify-center rounded-2xl text-secondary group-hover:scale-110 transition-transform border-[2px] border-secondary">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold">Local Gems</h3>
                <p className="text-on-surface-variant font-medium">Skip the tourist traps. We find the authentic spots only the locals know about, from Varanasi to Valparai.</p>
              </div>

              {/* Feature 3 */}
              <div className="bento-card bg-tertiary-fixed p-8 rounded-2xl flex flex-col items-start gap-6 group">
                <div className="w-16 h-16 bg-white/50 flex items-center justify-center rounded-2xl text-tertiary group-hover:scale-110 transition-transform border-[2px] border-tertiary">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold">Budget Friendly</h3>
                <p className="text-on-surface-variant font-medium">Get smart cost estimations and ways to save on domestic flights, trains, and heritage stays.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof/Destinations Grid */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md font-black text-on-surface text-center mb-16">Explore India's Favorites 🇮🇳</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Destination 1: Delhi */}
            <div className="group relative overflow-hidden rounded-2xl bento-card aspect-[4/5]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBvL5I-BzM6YMcC2Z76Tbdo7YON657E4cXg_VVB9PO0CAU5Ff_dVg0Ct0mVmiPVdQ56BxvucRTC2WRF2cNMviztdzrH7OjBcGjUA5XjvM5XV3W2vbS0yRGgFPbpr7-Mn4ovuTOf4SXLGC_94pbRmcIFWa4CRHYRlFPKSq8f4ZxnspJc4-R3FKVJ4F2-iRjYyGNFP9yuJaWzL_fJKuc0zEArVbqXR_cvnJXY4mx2q1nw2kbGN1YAg6ukXg')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-label-sm font-bold bg-primary-container px-2 py-1 rounded mb-2 inline-block border-[2px] border-black">Popular</span>
                <h4 className="font-bold text-2xl font-headline-md">Delhi</h4>
                <p className="text-sm opacity-90 font-medium">History & Street Food</p>
              </div>
            </div>

            {/* Destination 2: Jaipur */}
            <div className="group relative overflow-hidden rounded-2xl bento-card aspect-[4/5] md:translate-y-8">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBz_JzsGDGIRt8ddpHxGTbbsfbLt_qq_Y6If9l9TgSXmh8I4GJdr7NxPIGGWdySDabU1U1ryboBcNYCLdjKZzxhwtX5s8_5MYTAm_8lk6jWSu3YnQgw8KEk4H9nHl394BfD8rTUXcV7sISnQdY2DwGJPcw58sC9vAgYpmN1Vvb3BCEmnfVMulwvoe3aijaxTgUA6Rigj0RSwLqyKo-Ys4mHiNpZ5iV4mSTJlKd8OenLL_yqB6Gzps3-2w')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-label-sm font-bold bg-secondary px-2 py-1 rounded mb-2 inline-block border-[2px] border-black">Heritage</span>
                <h4 className="font-bold text-2xl font-headline-md">Jaipur</h4>
                <p className="text-sm opacity-90 font-medium">Royal Palaces & Forts</p>
              </div>
            </div>

            {/* Destination 3: Goa */}
            <div className="group relative overflow-hidden rounded-2xl bento-card aspect-[4/5]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAILc__dVuLQpEfEOwBqcmufc-da_7ue_bcW1C5vIMDkyzOXS7eycTwT_SY6ggXhFT_QRdWFk6wz0J5nSuKJud2gbEFKaleX9P0uldYGiMJ2eYYinqStMASDTCy77QfM7bPWkgaczRPI8aYG5oq0JJglwKRsnf_AVaQxCDyyiQPEN_fjfos2YopB956c1QFDMU9YIf-F5ySxDRpxqB-C3U79Yn65tHDc0nugVNC20lXY5uBjb1QQFsMsA')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-label-sm font-bold bg-tertiary-container px-2 py-1 rounded mb-2 inline-block border-[2px] border-black">Relax</span>
                <h4 className="font-bold text-2xl font-headline-md">Goa</h4>
                <p className="text-sm opacity-90 font-medium">Sun, Sand & Serenity</p>
              </div>
            </div>

            {/* Destination 4: Kerala */}
            <div className="group relative overflow-hidden rounded-2xl bento-card aspect-[4/5] md:translate-y-8">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuARDnb1ZvmJynLXHXipALmwtmJ_hpFSo2528l_a_PwrPFwa1AK2JYVELaEmx89Go6iniXxdeIdbLO8rI7hY55qn853ltTJ_KUdJUUAJrS2BKWNn2PDQMXx_VSOZrTXHnTYdD0sQ7i1Lb4dVIEazTMbE0Xm6hMztqn_NSrPli_t7hgC203x9TF7Huvbvyo5axFvmlwU7tQa39DnZOtDBD-eygmMtmcZYgrDtX-JQZ5Mj-dIaLlXd63xUjw')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-label-sm font-bold bg-error px-2 py-1 rounded mb-2 inline-block border-[2px] border-black">Nature</span>
                <h4 className="font-bold text-2xl font-headline-md">Kerala</h4>
                <p className="text-sm opacity-90 font-medium">Backwaters & Lush Greenery</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="bento-card bg-primary-container p-8 md:p-12 rounded-[40px] text-center relative overflow-hidden">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <div className="relative z-10">
                <h2 className="font-display-lg text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
                  Ready to discover <br /> the real India?
                </h2>
                <p className="text-white/90 text-xl mb-12 max-w-xl mx-auto font-medium">
                  Join over 50,000+ travelers who use Tripzy to plan adventures that last a lifetime.
                </p>
                <Link to="/plan" className="bg-white text-primary-container px-8 md:px-12 py-6 rounded-2xl font-black text-xl md:text-2xl btn-shadow flex items-center justify-center gap-3 mx-auto hover:scale-[1.02] active:scale-95 transition-transform border-[3px] border-[#251913] max-w-lg">
                  Start Your Next Adventure 🌴
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
