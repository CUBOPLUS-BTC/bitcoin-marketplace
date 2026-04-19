import React from 'react';
import Link from 'next/link';

export function MarketplaceNavbar() {
  return (
    <nav aria-label="Main Navigation" className="bg-[#0e0e10]/60 backdrop-blur-[40px] font-['Inter'] text-sm tracking-tight docked full-width top-0 sticky z-50 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-200">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-xl font-black tracking-tighter text-[#e7e4ea] hover:bg-[#2c2c30] transition-all duration-200 active:scale-95 ease-in-out p-2 rounded"
          >
            Sovereign Ledger
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-[#ffb874] font-bold border-b-2 border-[#ffb874] pb-1 hover:bg-[#2c2c30] transition-all duration-200 p-2 rounded-t"
            >
              Explore
            </Link>
            <Link 
              href="/dashboard" 
              className="text-[#acaab0] hover:text-[#e7e4ea] transition-colors hover:bg-[#2c2c30] p-2 rounded"
            >
              My Escrows
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#acaab0] text-sm font-light">search</span>
            <input 
              className="bg-[#25252a] border-b-2 border-transparent focus:border-[#ffb874] text-[#e7e4ea] text-sm rounded py-2 pl-9 pr-4 w-64 focus:outline-none transition-colors" 
              placeholder="Search marketplace..." 
              type="text"
            />
          </div>
          <button className="bg-[#ffb874] text-[#613500] font-medium py-2 px-4 rounded hover:bg-[#e78603] transition-colors shadow-[0_4px_14px_rgba(255,184,116,0.2)]">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
