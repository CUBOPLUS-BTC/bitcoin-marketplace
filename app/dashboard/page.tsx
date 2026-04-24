"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMultisigStore } from "@/store/useMultisigStore";
import { EscrowStatusCard } from "@/components/multisig/EscrowStatusCard";
import { PSBTSignModal } from "@/components/multisig/PSBTSignModal";
import { 
  ShoppingBag, 
  Tag, 
  Gavel, 
  Settings, 
  Search, 
  Bell, 
  Wallet,
  Key,
  Cpu,
  Save,
  ChevronRight,
  History,
  X
} from "lucide-react";

export default function DashboardPage() {
  const { 
    trades,
    activeEscrow,
    fetchTrades,
    fetchEscrow,
    signPSET,
    isLoading,
    user
  } = useMultisigStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales' | 'disputes'>('purchases');

  // Initial data fetch
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // Polling for detail status if a trade is selected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedTradeId) {
      fetchEscrow(selectedTradeId);
      interval = setInterval(() => fetchEscrow(selectedTradeId), 5000);
    }
    return () => clearInterval(interval);
  }, [selectedTradeId, fetchEscrow]);

  const handleSignTransaction = async () => {
    if (!selectedTradeId || !activeEscrow) return;
    try {
      await signPSET(selectedTradeId, (activeEscrow as any).pset_base64 || 'demo-mock-pset');
      setIsModalOpen(false);
    } catch (e) {}
  };

  const handleTabChange = (tab: 'purchases' | 'sales' | 'disputes') => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    setSelectedTradeId(null);
  };

  // Filter trades based on tab and logged in user
  const filteredTrades = trades.filter(t => {
    if (user?.role === 'admin') return true; // Admins see everything
    if (activeTab === 'purchases') return t.buyer_id === user?.id;
    if (activeTab === 'sales') return t.seller_id === user?.id;
    return false;
  });

  const pageHeaders = {
    purchases: { title: "Mis Compras", subtitle: "Operaciones donde eres el comprador" },
    sales: { title: "Mis Ventas", subtitle: "Operaciones donde eres el vendedor" },
    disputes: { title: "Centro de Disputas", subtitle: "Arbitraje y resolución de conflictos" }
  };

  return (
    <div className="bg-[#0e0e10] text-[#e7e4ea] antialiased flex overflow-hidden min-h-screen">
      {/* SideNavBar */}
      <aside className="bg-zinc-950 font-['Inter'] tracking-tight antialiased h-screen w-64 border-r border-zinc-800/50 flex flex-col fixed left-0 top-0 p-6 z-40 hidden md:flex">
        <div className="mb-12">
          <Link href="/" className="text-xl font-bold tracking-tighter text-[#ffb874] uppercase">
            Sovereign Ledger
          </Link>
          <p className="text-[10px] uppercase tracking-wider text-[#acaab0] mt-1 font-semibold">{user?.display_name || 'Verified Account'}</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          <button 
            onClick={() => handleTabChange('purchases')}
            className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 rounded text-left ${activeTab === 'purchases' ? 'text-[#ffb874] font-semibold bg-zinc-900/60 border-r-2 border-[#ffb874]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/80'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm">Mis Compras</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('sales')}
            className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 rounded text-left ${activeTab === 'sales' ? 'text-[#ffb874] font-semibold bg-zinc-900/60 border-r-2 border-[#ffb874]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/80'}`}
          >
            <Tag className="w-5 h-5" />
            <span className="text-sm">Mis Ventas</span>
          </button>
          
          <button 
             onClick={() => handleTabChange('disputes')}
             className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 rounded text-left ${activeTab === 'disputes' ? 'text-[#ffb874] font-semibold bg-zinc-900/60 border-r-2 border-[#ffb874]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/80'}`}
          >
            <Gavel className="w-5 h-5" />
            <span className="text-sm">Disputas</span>
          </button>
          
          <button className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/80 rounded transition-all duration-200 mt-auto text-left">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Configuración</span>
          </button>
        </nav>
        
        {!user && (
          <button className="mt-6 w-full py-3 bg-[#ffb874] text-[#613500] font-semibold text-sm rounded transition-colors hover:bg-[#e78603]">
            Login Session
          </button>
        )}
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen">
        {/* TopAppBar */}
        <header className="bg-zinc-950/80 backdrop-blur-xl font-['Inter'] uppercase tracking-widest text-[10px] w-full h-16 border-b border-zinc-800/30 sticky top-0 z-50 flex items-center justify-between px-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <span className="text-[#ffb874] font-bold text-sm tracking-wider">Platform Terminal</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input 
                className="bg-[#25252a] border-none rounded-none w-48 py-2 pl-3 pr-10 text-[#e7e4ea] placeholder:text-zinc-500 focus:ring-1 focus:ring-[#ffb874] text-[10px] uppercase tracking-wider" 
                placeholder="SEARCH TRADE ID..." 
                type="text" 
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Wallet className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#25252a] overflow-hidden border border-[#48474c]/30">
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-black"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Box (Flex Layout for Sidebar) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Canvas */}
          <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
            {/* Page Header */}
            <div className="mb-12">
              <h2 className="text-[2rem] font-bold tracking-tight text-[#e7e4ea] mb-2" style={{ letterSpacing: "-0.02em" }}>
                {pageHeaders[activeTab].title}
              </h2>
              <p className="text-sm text-[#acaab0] font-medium">{pageHeaders[activeTab].subtitle}</p>
            </div>

            {/* Escrow List Container */}
            <div className="flex flex-col gap-8 w-full max-w-5xl">
              
              {filteredTrades.length === 0 && !isLoading && (
                <div className="bg-[#131316] p-12 rounded-lg border border-dashed border-[#48474c]/30 text-center">
                  <p className="text-[#acaab0] uppercase tracking-widest text-xs font-bold">No hay operaciones que mostrar</p>
                </div>
              )}

              {filteredTrades.map((trade) => (
                <div 
                  key={trade.id}
                  onClick={() => { setSelectedTradeId(trade.id); setIsSidebarOpen(true); }}
                  className={`bg-[#131316] p-6 rounded-lg relative overflow-hidden group cursor-pointer border ${selectedTradeId === trade.id ? 'border-[#ffb874]/50' : 'border-transparent'}`}
                >
                  <div className="absolute inset-0 bg-[#1f1f23] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-[#25252a] flex items-center justify-center rounded">
                            <Key className="text-[#ffb874] w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-lg font-semibold text-[#e7e4ea]">Liquid Escrow Trade</span>
                                <span className="text-[10px] uppercase tracking-wider text-[#acaab0]">#{trade.id.substring(0, 8)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#acaab0]">
                                <ShoppingBag className="w-4 h-4" />
                                <span className="capitalize">{trade.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-12">
                        <div className="text-right">
                            <span className="block text-[10px] uppercase tracking-wider text-[#acaab0] mb-1 font-bold">Valor Segurado</span>
                            <span className="text-xl font-bold text-[#fe9821]">{(trade.quantity * trade.price_sat / 100_000_000).toFixed(4)} BTC</span>
                        </div>
                        <div className="flex flex-col items-end gap-3 min-w-[140px]">
                            <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${trade.status === 'settled' ? 'bg-[#f1eeaa] text-[#5a5924]' : 'bg-[#25252a] text-[#ffb874] border border-[#ffb874]/20'}`}>
                                {trade.status === 'settled' ? 'Completado' : 'Pendiente'}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#ffb874] flex items-center gap-1 group-hover:translate-x-1 duration-200">
                                Ver Detalles <ChevronRight className="w-4 h-4" />
                            </span>
                        </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* DISPUTES TAB */}
              {activeTab === 'disputes' && (
                 <div className="bg-[#131316] p-12 rounded-lg border border-dashed border-[#48474c]/30 text-center">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Gavel className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-[#acaab0] uppercase tracking-widest text-xs font-bold">Sin disputas activas</p>
                    <p className="text-[10px] text-zinc-500 mt-2">Todo funciona correctamente en tus operaciones</p>
                 </div>
              )}
            </div>
          </main>

          {/* Detailed View Panel */}
          <div className={`
            h-full w-96 bg-[#1f1f23] border-l border-zinc-800/50 shadow-2xl flex flex-col 
            transition-all duration-300 ease-in-out fixed xl:relative right-0 top-0 z-40
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full xl:hidden'}
          `}>
            {isSidebarOpen && (
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-[#e7e4ea]">Trade Details</h3>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {activeEscrow ? (
                    <div className="space-y-6">
                       <EscrowStatusCard 
                        orderId={activeEscrow.trade_id.substring(0, 8)}
                        btcAmount="0.00000000" // Should be trade quantity
                        usdValue="0.00"
                        signaturesRequired={2}
                        signaturesAcquired={(activeEscrow.buyer_signed ? 1 : 0) + (activeEscrow.seller_signed ? 1 : 0)}
                        onSignAction={() => setIsModalOpen(true)}
                        status={activeEscrow.status}
                      />
                      
                      <div className="p-4 bg-[#000000]/50 rounded-lg border border-[#48474c]/30 font-mono text-[10px] space-y-2">
                         <p className="text-[#acaab0] uppercase font-bold">Dirección Liquid Multisig:</p>
                         <p className="text-[#ffb874] break-all">{activeEscrow.multisig_address || 'Derivando...'}</p>
                      </div>

                      <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-[10px] space-y-2">
                        <p className="text-zinc-500 uppercase font-bold">Estado de Firmas:</p>
                        <div className="flex justify-between">
                          <span>Comprador</span>
                          <span className={activeEscrow.buyer_signed ? "text-green-500" : "text-yellow-500"}>
                            {activeEscrow.buyer_signed ? "Signed" : "Pending"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vendedor</span>
                          <span className={activeEscrow.seller_signed ? "text-green-500" : "text-yellow-500"}>
                            {activeEscrow.seller_signed ? "Signed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 border-2 border-dashed border-[#48474c]/30 rounded flex items-center justify-center p-8 bg-[#000000]/50 h-64">
                      <p className="text-sm text-[#acaab0] font-mono text-center uppercase tracking-wider">
                        Cargando Detalles...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PSBTSignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSign={handleSignTransaction}
        isSigning={isLoading}
        minerFee="0.00000180 BTC (L2)"
        totalOutput="Liquid PSET Release"
        destinationAddress="Managed by Protocol"
      />
    </div>
  );
}
