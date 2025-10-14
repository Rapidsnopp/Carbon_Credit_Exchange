import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// components/Header.jsx
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Function to check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <span className="ml-3 text-xl font-bold text-white">Caelum</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
              isActive('/') 
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
            }`}
            onClick={() => handleNavigation('/')}
          >
            Home
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
              isActive('/mint') 
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
            }`}
            onClick={() => handleNavigation('/mint')}
          >
            Mint NFT
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
              isActive('/trading') 
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
            }`}
            onClick={() => handleNavigation('/trading')}
          >
            Trading
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
              isActive('/verify-credits') 
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
            }`}
            onClick={() => handleNavigation('/verify-credits')}
          >
            Verify Credits
          </button>
        </div>

        <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30">
          Connect Wallet
        </button>
      </nav>
    </header>
  );
};

export default Header;