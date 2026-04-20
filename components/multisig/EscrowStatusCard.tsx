import React from 'react';
import { Check, Edit2, Gavel, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EscrowStatusCardProps {
  orderId: string;
  btcAmount: string;
  usdValue: string;
  signaturesRequired: number;
  signaturesAcquired: number;
  onSignAction: () => void;
  status?: string;
}

export function EscrowStatusCard({
  orderId,
  btcAmount,
  usdValue,
  signaturesRequired,
  signaturesAcquired,
  onSignAction,
  status = 'pending'
}: EscrowStatusCardProps) {
  const isBuyerSigned = signaturesAcquired >= 1; // Simplified logic or actual state
  const isSellerSigned = signaturesAcquired >= 2;

  const statusColors: Record<string, string> = {
    pending: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    funded: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    shipped: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    released: 'bg-green-500/10 text-green-500 border-green-500/20',
    disputed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="w-full max-w-sm glass-panel rounded-2xl p-6 shadow-2xl border border-white/5 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-foreground font-semibold text-lg tracking-tight">
          Trade #{orderId}
        </h2>
        <div className={`px-2.5 py-0.5 rounded-full border ${statusColors[status] || statusColors.pending}`}>
          <span className="text-xs font-semibold uppercase tracking-wider">
            {status}
          </span>
        </div>
      </div>

      {/* Balance Section */}
      <div className="mb-6 flex flex-col items-center">
        <div className="text-3xl font-bold tracking-tight text-foreground mb-1 num-tabular">
          {btcAmount !== "0.00000000" ? btcAmount : "Liquid Asset"}
        </div>
        <div className="text-muted-foreground text-xs font-medium uppercase tracking-widest opacity-80">
          Escrow Locked Value
        </div>
      </div>

      <div className="h-px w-full bg-border/50 mb-6" />

      {/* Progress (M-of-N Stepper) */}
      <div className="mb-8">
        <h3 className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-center opacity-70">
          Signatures: <span className="text-[#ffb874] num-tabular">{signaturesAcquired}</span> / <span className="num-tabular">{signaturesRequired}</span>
        </h3>
        <div className="flex justify-between items-center px-2">
          
          {/* Comprador (Buyer) */}
          <div className="flex flex-col items-center gap-2 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isBuyerSigned ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(54,214,158,0.2)]' : 'bg-white/[0.03] border-dashed border-zinc-700'}`}>
              {isBuyerSigned ? <Check className="text-primary w-5 h-5" /> : <Edit2 className="text-zinc-600 w-4 h-4" />}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isBuyerSigned ? 'text-primary' : 'text-zinc-500'}`}>Comprador</span>
          </div>

          {/* Connector Line */}
          <div className={`flex-1 h-px mx-2 mt-[-20px] transition-colors duration-1000 ${isBuyerSigned ? 'bg-primary/50' : 'bg-border/30'}`} />

          {/* Vendedor (Seller) */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isSellerSigned ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(54,214,158,0.2)]' : (isBuyerSigned ? 'bg-orange-500/10 border-dashed border-orange-500/50 animate-pulse' : 'bg-white/[0.03] border-dashed border-zinc-700')}`}>
              {isSellerSigned ? <Check className="text-primary w-5 h-5" /> : <Edit2 className={isBuyerSigned ? "text-orange-500 w-4 h-4" : "text-zinc-600 w-4 h-4"} />}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isSellerSigned ? 'text-primary' : (isBuyerSigned ? 'text-orange-500' : 'text-zinc-500')}`}>Vendedor</span>
          </div>

          {/* Connector Line */}
          <div className={`flex-1 h-px mx-2 mt-[-20px] transition-colors duration-1000 ${isSellerSigned ? 'bg-primary/50' : 'bg-border/30'}`} />

          {/* Platform Arbiter */}
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <Gavel className="text-muted-foreground w-4 h-4" />
            </div>
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Protocol</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <Button 
        onClick={onSignAction}
        disabled={status === 'released' || status === 'refunded'}
        className="w-full flex justify-center items-center gap-2 bg-[#ffb874] text-[#613500] hover:bg-[#ffaa55]"
        size="lg"
      >
        <PenTool className="w-4 h-4" />
        Firmar PSET (Liquid)
      </Button>

      <div className="mt-4 text-center">
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">
          Marketplace Escrow Engine
        </span>
      </div>
    </div>
  );
}
