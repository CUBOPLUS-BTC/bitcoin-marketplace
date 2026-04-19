import React from 'react';

export function MarketplaceFooter() {
  return (
    <footer className="bg-[#0e0e10] font-['Inter'] text-xs uppercase tracking-[0.05em] w-full py-12 border-t border-[#48474c]/15 opacity-80 hover:opacity-100 transition-opacity mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-[1440px] mx-auto gap-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-[#e7e4ea]">Sovereign Ledger</span>
          <span className="text-[#acaab0]">© 2024 Sovereign Ledger. Built for the Infinite Void.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-[#acaab0] hover:text-[#ffb874] transition-colors" href="#">Security</a>
          <a className="text-[#acaab0] hover:text-[#ffb874] transition-colors" href="#">Escrow Logic</a>
          <a className="text-[#acaab0] hover:text-[#ffb874] transition-colors" href="#">Nodes</a>
          <a className="text-[#acaab0] hover:text-[#ffb874] transition-colors" href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
