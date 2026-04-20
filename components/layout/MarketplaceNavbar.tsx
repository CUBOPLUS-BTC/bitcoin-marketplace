import React from 'react';
import Link from 'next/link';
import { useMultisigStore } from '@/store/useMultisigStore';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';

export function MarketplaceNavbar() {
  const { wallet, connectWallet, user, login } = useMultisigStore();

  return (
    <nav aria-label="Main Navigation" className="bg-[#0e0e10]/60 backdrop-blur-[40px] font-['Inter'] text-sm tracking-tight docked full-width top-0 sticky z-50 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-200">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-xl font-black tracking-tighter text-[#e7e4ea] hover:opacity-80 transition-all duration-200 active:scale-95 ease-in-out px-2"
          >
            Sovereign Ledger
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-[#ffb874] font-bold border-b-2 border-[#ffb874] pb-1 transition-all duration-200"
            >
              Explore
            </Link>
            <Link 
              href="/dashboard" 
              className="text-[#acaab0] hover:text-[#e7e4ea] transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              My Trades
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#acaab0] text-sm font-light">search</span>
            <input 
              className="bg-[#25252a] border border-zinc-800 focus:border-[#ffb874]/50 text-[#e7e4ea] text-xs rounded py-2.5 pl-9 pr-4 w-64 focus:outline-none transition-colors shadow-inner" 
              placeholder="Search marketplace..." 
              type="text"
            />
          </div>
          
            <div className="flex items-center gap-4">
              {!user ? (
                <button 
                  onClick={() => login('demo@example.com', 'password')}
                  className="bg-zinc-800 text-[#acaab0] hover:text-[#e7e4ea] border border-zinc-700 hover:border-zinc-600 font-black text-[10px] uppercase tracking-widest py-2.5 px-6 rounded transition-all duration-300"
                >
                  Login Demo
                </button>
              ) : (
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Connected as</span>
                  <span className="text-[#e7e4ea] font-bold text-xs">{user.display_name}</span>
                </div>
              )}
              
              <button 
                onClick={() => connectWallet('buyer')}
                className={`font-black text-[10px] uppercase tracking-[0.1em] py-2.5 px-6 rounded transition-all duration-300 shadow-[0_4px_14px_rgba(255,184,116,0.1)] flex items-center gap-2
                  ${wallet.isConnected 
                    ? 'bg-zinc-800 text-[#ffb874] border border-[#ffb874]/20' 
                    : 'bg-[#ffb874] text-[#613500] hover:bg-[#ffaa55]'}
                `}
              >
                {wallet.isConnected ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    {wallet.address?.substring(0, 6)}...{wallet.address?.substring(wallet.address.length - 4)}
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            </div>
        </div>
      </div>
    </nav>
  );
}
