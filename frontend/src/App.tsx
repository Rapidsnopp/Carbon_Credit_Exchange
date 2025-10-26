import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WalletProvider, ToastProvider } from "./contexts";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import VerifyCredits from "./pages/VerifyCredits";
import Trading from "./pages/Trading";
import MintNFT from "./pages/MintNFT";
import NFTDetails from "./pages/NFTDetails";
import MyNFTs from "./pages/MyNFTs";
import APITest from "./pages/APITest";

export default function App() {
  return (
    <WalletProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Layout bao quanh các route con */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/mint" element={<MintNFT />} />
              <Route path="/verify-credits" element={<VerifyCredits />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/nft/:id" element={<NFTDetails />} />
              <Route path="/my-nfts" element={<MyNFTs />} />
              <Route path="/test-api" element={<APITest />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </WalletProvider>
  );
}
