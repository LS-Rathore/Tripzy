import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PlanTripPage from './pages/PlanTripPage';
import ItineraryPage from './pages/ItineraryPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/plan" element={<PlanTripPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
