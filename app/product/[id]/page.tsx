"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { MarketplaceNavbar } from "@/components/layout/MarketplaceNavbar";
import { MarketplaceFooter } from "@/components/layout/MarketplaceFooter";
import { MultisigSetupForm } from "@/components/multisig/MultisigSetupForm";
import { ShieldCheck, Star, ShieldAlert } from "lucide-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'trezor-safe-3';

  const products: Record<string, any> = {
    "trezor-safe-3": {
      name: "Trezor Safe 3 - Bitcoin Only Edition",
      image: "/images/products/trezor.png",
      price: "0.045",
      seller: "@Satoshi_Nakamoto",
      sellerPub: "02cc3a96860f4e3dfba60ed44436841893118471"
    },
    "bitbox-02": {
      name: "BitBox02 Bitcoin-only",
      image: "/images/products/bitbox.png",
      price: "0.021",
      seller: "@HalFinney",
      sellerPub: "03f6f059103c8c7f07018d9668bd52f53434698544ff87034c5409a4192d77d71f"
    },
    "titanium-seed-plate": {
      name: "Titanium Seed Plate",
      image: "/images/products/seedplate.png",
      price: "0.015",
      seller: "@CypherPunk99",
      sellerPub: "026a0403306db49f78cd20f78943916298533cfc"
    }
  };

  const product = products[id] || products["trezor-safe-3"];

  const handleGenerate = () => {
    router.push("/dashboard");
  };

  return (
    <div className="antialiased bg-[#0e0e10] text-[#e7e4ea] min-h-screen flex flex-col pt-20">
      <MarketplaceNavbar />

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Product Info (2/3) */}
          <section className="lg:col-span-8 flex flex-col gap-10">
            {/* Product Image */}
            <div className="w-full aspect-[16/9] bg-[#131316] rounded-lg flex items-center justify-center overflow-hidden border border-[#48474c]/15 relative shadow-2xl">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#e7e4ea] leading-tight">
                {product.name}
              </h1>
              
              {/* Seller & Reputation */}
              <div className="flex flex-wrap items-center gap-6 pb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25252a] border border-[#48474c]/15 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-[#acaab0] text-xl">person</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-lg text-[#e7e4ea] tracking-wide">{product.seller}</span>
                    <ShieldCheck className="text-[#ffb874] w-5 h-5 fill-[#ffb874]" />
                  </div>
                </div>
                
                <div className="h-6 w-[1px] bg-[#48474c]/30 hidden sm:block"></div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-[#ffb874]">
                    <Star className="w-5 h-5 fill-[#ffb874]" />
                    <Star className="w-5 h-5 fill-[#ffb874]" />
                    <Star className="w-5 h-5 fill-[#ffb874]" />
                    <Star className="w-5 h-5 fill-[#ffb874]" />
                    <Star className="w-5 h-5 fill-[#ffb874]" />
                  </div>
                  <span className="text-[#acaab0] font-medium text-sm tracking-wide">482 Escrow Sales</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#131316] p-8 rounded-lg border border-[#48474c]/15">
                <h3 className="text-xl font-bold mb-4 text-[#e7e4ea]">Product Overview</h3>
                <p className="text-[#acaab0] text-lg leading-relaxed">
                  High-fidelity hardware wallet with specialized security for the Bitcoin network. Shipped with tamper-evident seal. Engineered for absolute sovereignty, this device ensures your private keys never touch an internet-connected environment. Designed exclusively for the rigorous demands of the Bitcoin protocol.
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Checkout Box (1/3) */}
          <section className="lg:col-span-4 sticky top-32">
            <div className="bg-[#25252a] rounded-lg p-8 border border-[#48474c]/15 flex flex-col gap-8 shadow-2xl">
              
              {/* Price */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#acaab0] font-bold">Total Price</span>
                <div className="text-[#fe9821] text-5xl font-black tracking-tighter leading-none">
                  {product.price} <span className="text-2xl text-[#fe9821]/70 align-top">BTC</span>
                </div>
              </div>

              {/* Fees */}
              <div className="flex flex-col gap-4 py-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#acaab0]">Miner Fee (Est)</span>
                  <span className="text-[#e7e4ea] font-semibold">12 sats/vB</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#acaab0]">Marketplace Fee</span>
                  <span className="text-[#e7e4ea] font-semibold">1%</span>
                </div>
              </div>

              {/* Warning Badge */}
              <div className="bg-[#f1eeaa]/10 border border-[#ffb874]/20 rounded p-4 flex gap-4 items-start">
                <ShieldAlert className="text-[#ffb874] w-5 h-5 shrink-0" />
                <p className="text-sm text-[#e8e6a2] leading-snug font-medium">
                  Tus fondos estarán bloqueados en un contrato 2-de-3 hasta que confirmes la entrega.
                </p>
              </div>

              {/* Injection Area: Real MultisigSetupForm */}
              <div className="flex flex-col gap-6">
                 <MultisigSetupForm 
                    onGenerate={handleGenerate} 
                    priceBtc={product.price}
                    sellerPublicKey={product.sellerPub}
                 />
              </div>
            </div>
          </section>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
