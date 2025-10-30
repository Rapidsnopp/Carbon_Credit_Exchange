import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css"; // bắt buộc import CSS

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  const { connected, publicKey, connect } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <span className="ml-3 text-xl font-bold text-white">verdeX</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          {["/", "/trading", "/mint", "/verify-credits", "/my-nfts"].map((path, idx) => {
            const labels = ["Home", "Trading", "Mint NFT", "Verify Credits", "My NFTs"];
            return (
              <button
                key={path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive(path)
                  ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                onClick={() => handleNavigation(path)}
              >
                {labels[idx]}
              </button>
            );
          })}
        </div>

        {/* Wallet Connect */}
        <div>
          <WalletMultiButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
