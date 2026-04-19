"use client";

import React, { useState, useEffect } from "react";
import { MultisigSetupForm } from "@/components/multisig/MultisigSetupForm";
import { EscrowStatusCard } from "@/components/multisig/EscrowStatusCard";
import { PSBTSignModal } from "@/components/multisig/PSBTSignModal";
import { ArbitratorDesk } from "@/components/multisig/ArbitratorDesk";
import { useMultisigStore } from "@/store/useMultisigStore";
import { cn } from "@/lib/utils";

// Mock events for the ArbitratorDesk
const mockEvents = [
  {
    id: "1",
    title: "Vínculo de Escrow Creado",
    timestamp: "Hace 2 horas",
    description: "Contrato multifirma 2-de-3 generado exitosamente.",
    type: "success" as const,
  },
  {
    id: "2",
    title: "Pendiente de Fondeo",
    timestamp: "Hace 1 hora",
    description: "Esperando depósito del comprador en la dirección P2WSH.",
    type: "info" as const,
  },
];

export default function Home() {
  const { 
    step, 
    setStep, 
    contractParams, 
    escrowState, 
    signPSBT, 
    fetchStatus,
    isLoading,
    resetStore
  } = useMultisigStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Polling for status when in escrow view
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'escrow' && contractParams.id) {
      fetchStatus(); // Call immediately
      interval = setInterval(() => {
        fetchStatus();
      }, 10000); // Check every 10 seconds
    }
    return () => clearInterval(interval);
  }, [step, contractParams.id, fetchStatus]);

  const handleSignTransaction = async () => {
    // In a real app, the PSBT would be fetched from the backend or status
    // For this demo, we assume a PSBT is available to sign
    const dummyPsbtHex = "70736274ff010074...dummy_psbt_hex"; 
    
    try {
      await signPSBT(dummyPsbtHex);
      setIsModalOpen(false);
    } catch (error) {
      // Error is handled in the store and displayed in the UI if needed
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center bg-mesh bg-grain">
      {/* Header Navigation */}
      <header className="w-full border-b border-white/5 glass-panel sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetStore}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-sm">S</span>
            </div>
            <span className="font-bold tracking-tight text-lg">Satsy Escrow</span>
          </div>

          <nav className="flex gap-1 bg-secondary/50 p-1 rounded-lg border border-border">
            {(["setup", "escrow", "dispute"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStep(tab as any)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all",
                  step === tab
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === 'dispute' ? 'arbitrator' : tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        
        {/* Step 1: Setup */}
        {step === "setup" && (
          <div className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MultisigSetupForm />
          </div>
        )}

        {/* Step 2: Escrow Management */}
        {step === "escrow" && (
          <div className="w-full flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EscrowStatusCard
              orderId={contractParams.id ? contractParams.id.substring(0, 8) : "####"}
              btcAmount={(escrowState.amountExpected / 100_000_000).toFixed(8)}
              usdValue={(escrowState.amountExpected * 0.0006).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} // Simple mock conversion
              signaturesRequired={escrowState.signaturesRequired}
              signaturesAcquired={escrowState.signaturesAcquired}
              onSignAction={() => setIsModalOpen(true)}
            />
            
            {/* Additional Info for Dev/Debug */}
            <div className="w-full max-w-md p-4 bg-secondary/20 rounded-lg border border-border/50">
              <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-3 tracking-widest">
                Detalles del Contrato (On-Chain)
              </h3>
              <div className="space-y-3 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dirección:</span>
                  <span className="text-foreground break-all ml-4 text-right">
                    {contractParams.multisigAddress || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estatus Red:</span>
                  <span className={cn(
                    "font-bold num-tabular",
                    escrowState.isFunded ? "text-primary" : "text-orange-500"
                  )}>
                    {escrowState.isFunded ? "Fondeado (Confirmado)" : "Esperando Depósito…"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Dispute / Arbitrator */}
        {step === "dispute" && (
          <div className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ArbitratorDesk
              caseId={contractParams.id ? contractParams.id.substring(0, 4) : "000"}
              escrowBalance={(escrowState.balance.totalSats / 100_000_000).toFixed(4)}
              events={mockEvents}
              onReleaseToBuyer={() => alert("Liberación solicitada al Árbitro")}
              onRefundToSeller={() => alert("Reembolso solicitado al Árbitro")}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <PSBTSignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSign={handleSignTransaction}
        isSigning={isLoading}
        minerFee="0.00003200 BTC"
        totalOutput={(escrowState.amountExpected / 100_000_000).toFixed(8)}
        destinationAddress={contractParams.sellerPubkey ? "bc1q...Destination" : "Waiting for Setup..."}
      />

      {/* Footer Info */}
      <footer className="w-full py-8 text-center border-t border-white/5 mt-12 bg-white/[0.02] backdrop-blur-sm">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.3em] font-bold">
          Satsy Escrow Protocol • Secure & Open Source
        </p>
      </footer>
    </div>
  );
}
