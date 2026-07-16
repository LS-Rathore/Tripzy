import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import PlanTripPage from './pages/PlanTripPage';
import ItineraryPage from './pages/ItineraryPage';
import MyTripsPage from './pages/MyTripsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import ExplorePage from './pages/ExplorePage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/explore" element={<ExplorePage />} />

          {/* Protected (require auth) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/plan" element={<PlanTripPage />} />
            <Route path="/itinerary/:tripId" element={<ItineraryPage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
