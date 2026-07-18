import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

interface Destination {
  city: string;
  category: 'beach' | 'heritage' | 'adventure' | 'nature';
  image: string;
  duration: string;
  season: string;
  budget: string;
  description: string;
}

const DESTINATIONS: Destination[] = [
  // --- BEACH (5) ---
  {
    city: "Goa",
    category: "beach",
    image: "/images/destinations/goa.jpg",
    duration: "3 - 5 Days",
    season: "Oct - May",
    budget: "₹2,500 / Day",
    description: "Sun-kissed beaches, vibrant shacks, Portuguese architecture, and electric nightlife."
  },
  {
    city: "Varkala",
    category: "beach",
    image: "/images/destinations/varkala.jpg",
    duration: "2 - 4 Days",
    season: "Oct - Mar",
    budget: "₹1,800 / Day",
    description: "Stunning red cliffs overlooking the Arabian Sea, natural springs, and hippie beach vibes."
  },
  {
    city: "Pondicherry",
    category: "beach",
    image: "/images/destinations/pondicherry.jpg",
    duration: "2 - 3 Days",
    season: "Oct - Mar",
    budget: "₹2,200 / Day",
    description: "French colonial town with quiet beaches, colonial architecture, and spiritual vibes."
  },
  {
    city: "Gokarna",
    category: "beach",
    image: "/images/destinations/gokarna.jpg",
    duration: "2 - 4 Days",
    season: "Oct - Mar",
    budget: "₹1,500 / Day",
    description: "A temple town with secluded beaches like Om Beach and Half Moon Beach, popular among backpackers."
  },
  {
    city: "Kovalam",
    category: "beach",
    image: "/images/destinations/kovalam.jpg",
    duration: "3 - 4 Days",
    season: "Sep - Mar",
    budget: "₹2,400 / Day",
    description: "Famous crescent-shaped beaches, iconic red-and-white lighthouse, and Ayurvedic wellness centers."
  },

  // --- HERITAGE (5) ---
  {
    city: "Jaipur",
    category: "heritage",
    image: "/images/destinations/jaipur.jpg",
    duration: "2 - 3 Days",
    season: "Oct - Mar",
    budget: "₹2,000 / Day",
    description: "The Pink City. Majestic forts, stunning royal palaces, and rich Rajasthani heritage."
  },
  {
    city: "Agra",
    category: "heritage",
    image: "/images/destinations/agra.jpg",
    duration: "1 - 2 Days",
    season: "Oct - Mar",
    budget: "₹1,800 / Day",
    description: "Home of the Taj Mahal, Agra Fort, and rich Mughal history alongside the Yamuna River."
  },
  {
    city: "Varanasi",
    category: "heritage",
    image: "/images/destinations/varanasi.jpg",
    duration: "2 - 3 Days",
    season: "Oct - Mar",
    budget: "₹1,500 / Day",
    description: "One of the oldest living cities. Spiritual Ganga Aarti, sacred ghats, and labyrinth lanes."
  },
  {
    city: "Udaipur",
    category: "heritage",
    image: "/images/destinations/udaipur.jpg",
    duration: "3 - 4 Days",
    season: "Oct - Mar",
    budget: "₹2,800 / Day",
    description: "The City of Lakes. Romantic palaces floating on Lake Pichola, heritage mansions, and Mewar history."
  },
  {
    city: "Delhi",
    category: "heritage",
    image: "/images/destinations/delhi.jpg",
    duration: "3 - 5 Days",
    season: "Oct - Mar",
    budget: "₹2,500 / Day",
    description: "A mix of history and modernity. Mughal monuments, busy spice markets, and colonial buildings."
  },

  // --- ADVENTURE (4) ---
  {
    city: "Leh Ladakh",
    category: "adventure",
    image: "/images/destinations/leh-ladakh.jpg",
    duration: "5 - 7 Days",
    season: "May - Sep",
    budget: "₹3,500 / Day",
    description: "High-altitude cold desert. Dramatic mountain passes, pristine lakes, and monastery trails."
  },
  {
    city: "Rishikesh",
    category: "adventure",
    image: "/images/destinations/rishikesh.jpg",
    duration: "2 - 4 Days",
    season: "Sep - Jun",
    budget: "₹1,800 / Day",
    description: "Yoga Capital of the World. Thrilling white-water rafting, bungee jumping, and cafes."
  },
  {
    city: "Manali",
    category: "adventure",
    image: "/images/destinations/manali.jpg",
    duration: "3 - 5 Days",
    season: "Oct - Jun",
    budget: "₹2,000 / Day",
    description: "Gateway to Solang Valley and Rohtang Pass. Paragliding, rafting, skiing, and trekking trails."
  },
  {
    city: "Gulmarg",
    category: "adventure",
    image: "/images/destinations/gulmarg.jpg",
    duration: "3 - 5 Days",
    season: "Dec - Mar",
    budget: "₹4,000 / Day",
    description: "Skiing paradise of India. Gondola rides, snow-covered meadows, and breathtaking Himalayan peaks."
  },

  // --- NATURE (5) ---
  {
    city: "Munnar",
    category: "nature",
    image: "/images/destinations/munnar.jpg",
    duration: "3 - 4 Days",
    season: "Sep - May",
    budget: "₹2,200 / Day",
    description: "Lush green rolling hills, sprawling tea plantations, waterfalls, and misty viewpoints."
  },
  {
    city: "Coorg",
    category: "nature",
    image: "/images/destinations/coorg.jpg",
    duration: "2 - 4 Days",
    season: "Oct - Apr",
    budget: "₹2,300 / Day",
    description: "The Scotland of India. Misty coffee plantations, spice gardens, and Tibetan settlements."
  },
  {
    city: "Ooty",
    category: "nature",
    image: "/images/destinations/ooty.jpg",
    duration: "2 - 3 Days",
    season: "Oct - Jun",
    budget: "₹2,100 / Day",
    description: "Queen of Hill Stations. Rolling tea gardens, colonial charm, botanical gardens, and toy train rides."
  },
  {
    city: "Darjeeling",
    category: "nature",
    image: "/images/destinations/darjeeling.jpg",
    duration: "3 - 5 Days",
    season: "Sep - Jun",
    budget: "₹2,400 / Day",
    description: "Stunning views of Kanchenjunga, world-famous tea estates, toy trains, and Himalayan culture."
  },
  {
    city: "Alleppey",
    category: "nature",
    image: "/images/destinations/alleppey.jpg",
    duration: "2 - 3 Days",
    season: "Sep - Mar",
    budget: "₹2,600 / Day",
    description: "Famous backwaters, cozy houseboat cruises, palm-fringed canals, and peaceful village life."
  }
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [displayedDestinations, setDisplayedDestinations] = useState<Destination[]>([]);
  const [shuffleKey, setShuffleKey] = useState<number>(0);

  useEffect(() => {
    if (activeCategory === 'all') {
      const pickRandom = () => {
        const shuffled = [...DESTINATIONS].sort(() => Math.random() - 0.5);
        setDisplayedDestinations(shuffled.slice(0, 6));
        setShuffleKey(prev => prev + 1);
      };

      pickRandom();
      const intervalId = setInterval(pickRandom, 8000);
      return () => clearInterval(intervalId);
    } else {
      const filtered = DESTINATIONS.filter(d => d.category === activeCategory);
      setDisplayedDestinations(filtered);
      setShuffleKey(prev => prev + 1);
    }
  }, [activeCategory]);

  const handleQuickPlan = (city: string) => {
    navigate(`/plan?city=${encodeURIComponent(city)}`);
  };

  const categories = [
    { id: 'all', label: '✨ All Vibes' },
    { id: 'beach', label: '🏖️ Beaches' },
    { id: 'heritage', label: '🕌 Heritage' },
    { id: 'adventure', label: '🏔️ Adventure' },
    { id: 'nature', label: '🌲 Nature' }
  ];

  return (
    <div className="min-h-screen bg-tripzy-bg text-on-surface font-body-md flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-pattern -z-10 opacity-30"></div>
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-tripzy-orange/10 rounded-full blur-[120px] -z-10 animate-blob-morph"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-teal/10 rounded-full blur-[150px] -z-10 animate-blob-morph" style={{ animationDelay: '2s' }}></div>

      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 md:px-10 py-10 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-up">
          <div className="inline-block bg-black text-white font-black px-3 py-0.5 rounded-lg transform -rotate-2 w-max shadow-lg mb-4 text-xs uppercase tracking-wide">
            Destinations Hub
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-black text-on-surface mb-3 leading-tight tracking-tight">
            Explore India's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tripzy-orange to-orange-400">Greatest hits</span>
          </h1>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant font-medium leading-relaxed">
            Click a card to automatically pre-fill your AI planner and customize your trip.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-bold text-sm border-[3px] border-[#251913] transition-all bouncy-hover ${activeCategory === cat.id
                ? 'bg-tripzy-orange text-white shadow-[2px_2px_0px_0px_#251913]'
                : 'bg-white text-on-surface hover:bg-surface-variant'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Destination Grid */}
        <div key={shuffleKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {displayedDestinations.map((dest, index) => (
            <div
              key={dest.city}
              className="bento-card bg-white rounded-2xl border-[3px] border-black overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-premium-shuffle"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Image Container */}
              <div className="relative h-44 w-full overflow-hidden border-b-[3px] border-black">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider text-white bg-black px-2 py-0.5 rounded-full border-2 border-white">
                  {dest.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-2xl font-black font-display-lg text-on-surface mb-2">{dest.city}</h3>
                <p className="text-on-surface-variant font-medium text-xs leading-relaxed mb-4 flex-1">
                  {dest.description}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-1.5 border-t-2 border-outline-variant/30 pt-3 mb-4 text-center">
                  <div>
                    <span className="block text-[8px] font-black text-on-surface-variant uppercase tracking-wider">Duration</span>
                    <span className="text-[10px] font-bold text-on-surface">{dest.duration}</span>
                  </div>
                  <div className="border-x-2 border-outline-variant/30">
                    <span className="block text-[8px] font-black text-on-surface-variant uppercase tracking-wider">Best Season</span>
                    <span className="text-[10px] font-bold text-on-surface">{dest.season}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-on-surface-variant uppercase tracking-wider">Avg Budget</span>
                    <span className="text-[10px] font-bold text-on-surface">{dest.budget}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleQuickPlan(dest.city)}
                  className="w-full py-2.5 rounded-xl bg-tripzy-orange text-white font-black text-sm btn-shadow border-[3px] border-[#251913] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#251913] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-lg">flight_takeoff</span>
                  Quick Plan 🚀
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
