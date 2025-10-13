import React, { useState, useRef, useEffect } from 'react';

// components/Header.jsx
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg bg-gray-800/50">
            Home
          </button>
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Mint nft
          </button>
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Trading
          </button>
          {/* <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            About Us
          </button>
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Contact
          </button> */}
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Verify Credits
          </button>
        </div>

        <button className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors">
          Sign In 
        </button>
      </nav>
    </header>
  );
};

export default Header;