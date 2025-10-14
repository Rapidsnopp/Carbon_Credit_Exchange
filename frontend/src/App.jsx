import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VerifyCredits from './pages/VerifyCredits';
import Trading from './pages/Trading';
import MintNFT from './pages/MintNFT';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-credits" element={<VerifyCredits />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/mint" element={<MintNFT />} />
      </Routes>
    </Router>
  );
}