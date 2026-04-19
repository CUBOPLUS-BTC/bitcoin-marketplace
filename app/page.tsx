"use client";

import React from "react";
import Link from "next/link";
import { MarketplaceNavbar } from "@/components/layout/MarketplaceNavbar";
import { MarketplaceFooter } from "@/components/layout/MarketplaceFooter";

export default function Home() {
  return (
    <div className="antialiased min-h-screen flex flex-col bg-[#0e0e10] text-[#e7e4ea]">
      <MarketplaceNavbar />
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center w-full max-w-[1440px] mx-auto px-8 py-12 gap-16">
        
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#e7e4ea] max-w-3xl leading-tight">
            Compra y Vende con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb874] to-[#e78603]">Seguridad Multifirma</span>
          </h1>
          <p className="text-xl text-[#acaab0] max-w-2xl">
            The institutional-grade Bitcoin escrow marketplace. Trade high-value physical and digital goods with trustless, on-chain execution.
          </p>
          <div className="flex gap-8 mt-8 p-6 bg-[#131316] rounded-xl border border-[#48474c]/15">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.05em] text-[#acaab0] mb-1 font-bold">Contratos Activos</span>
              <span className="text-2xl font-bold text-[#fe9821]">1,240</span>
            </div>
            <div className="w-px bg-[#48474c]/15"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.05em] text-[#acaab0] mb-1 font-bold">Volumen BTC</span>
              <span className="text-2xl font-bold text-[#fe9821]">450.5 BTC</span>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="w-full space-y-8">
          <div className="flex justify-between items-end border-b border-[#48474c]/15 pb-4">
            <h2 className="text-2xl font-bold text-[#e7e4ea]">Trending Listings</h2>
            <button className="text-sm font-medium text-[#ffb874] hover:text-[#e78603] transition-colors flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <article className="bg-[#131316] rounded-xl overflow-hidden border border-[#48474c]/15 group hover:border-[#48474c]/30 transition-all">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="/images/products/trezor.png" 
                  alt="Trezor Safe 3" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-[#0e0e10]/80 backdrop-blur-md px-2 py-1 rounded border border-[#48474c]/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#ffb874] text-[16px]">verified</span>
                  <span className="text-[10px] font-semibold text-[#e7e4ea] uppercase">ESCROW</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#e7e4ea] truncate">Trezor Safe 3</h3>
                  <p className="text-sm text-[#acaab0] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span> @Satoshi_Nakamoto
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#acaab0] uppercase font-bold">Price</span>
                    <span className="text-lg font-bold text-[#fe9821]">0.045 BTC</span>
                  </div>
                  <Link 
                    href="/product/1" 
                    className="bg-[#ffb874] text-[#613500] font-medium py-2 px-4 rounded hover:bg-[#e78603] transition-colors text-sm shadow-[0_2px_8px_rgba(255,184,116,0.15)]"
                  >
                    Comprar con Escrow
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-[#131316] rounded-xl overflow-hidden border border-[#48474c]/15 group hover:border-[#48474c]/30 transition-all">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="/images/products/bitbox.png" 
                  alt="BitBox02" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-[#0e0e10]/80 backdrop-blur-md px-2 py-1 rounded border border-[#48474c]/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#ffb874] text-[16px]">verified</span>
                  <span className="text-[10px] font-semibold text-[#e7e4ea] uppercase">ESCROW</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#e7e4ea] truncate">BitBox02 Bitcoin-only</h3>
                  <p className="text-sm text-[#acaab0] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span> @HalFinney
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#acaab0] uppercase font-bold">Price</span>
                    <span className="text-lg font-bold text-[#fe9821]">0.021 BTC</span>
                  </div>
                  <Link 
                    href="/product/2"
                    className="bg-[#ffb874] text-[#613500] font-medium py-2 px-4 rounded hover:bg-[#e78603] transition-colors text-sm shadow-[0_2px_8px_rgba(255,184,116,0.15)]"
                  >
                    Comprar con Escrow
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-[#131316] rounded-xl overflow-hidden border border-[#48474c]/15 group hover:border-[#48474c]/30 transition-all">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="/images/products/seedplate.png" 
                  alt="Titanium Seed Plate" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-[#0e0e10]/80 backdrop-blur-md px-2 py-1 rounded border border-[#48474c]/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#ffb874] text-[16px]">verified</span>
                  <span className="text-[10px] font-semibold text-[#e7e4ea] uppercase">ESCROW</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#e7e4ea] truncate">Titanium Seed Plate</h3>
                  <p className="text-sm text-[#acaab0] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span> @CypherPunk99
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#acaab0] uppercase font-bold">Price</span>
                    <span className="text-lg font-bold text-[#fe9821]">0.015 BTC</span>
                  </div>
                  <Link 
                    href="/product/3"
                    className="bg-[#ffb874] text-[#613500] font-medium py-2 px-4 rounded hover:bg-[#e78603] transition-colors text-sm shadow-[0_2px_8px_rgba(255,184,116,0.15)]"
                  >
                    Comprar con Escrow
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
