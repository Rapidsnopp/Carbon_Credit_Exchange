import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WalletProvider, ToastProvider } from "./contexts";
import HomePage from "./pages/HomePage";
import VerifyCredits from "./pages/VerifyCredits";
import Trading from "./pages/Trading";
import MintNFT from "./pages/MintNFT";
import NFTDetails from "./pages/NFTDetails";
import NFTDetails from "./pages/NFTDetails";
import APITest from "./pages/APITest";

export default function App() {
  return (
    <WalletProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/verify-credits" element={<VerifyCredits />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/mint" element={<MintNFT />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
            <Route path="/nft/:id" element={<NFTDetails />} />
            <Route path="/api-test" element={<APITest />} />
          </Routes>
        </Router>
      </ToastProvider>
    </WalletProvider>
  );
}
