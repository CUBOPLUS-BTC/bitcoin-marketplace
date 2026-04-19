import React from 'react';
import { Check, Edit2, Gavel, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EscrowStatusCardProps {
  orderId: string;
  btcAmount: string;
  usdValue: string;
  signaturesRequired: number;
  signaturesAcquired: number;
  onSignAction: () => void;
}

export function EscrowStatusCard({
  orderId,
  btcAmount,
  usdValue,
  signaturesRequired,
  signaturesAcquired,
  onSignAction
}: EscrowStatusCardProps) {
  return (
    <div className="w-full max-w-sm glass-panel rounded-2xl p-6 shadow-2xl border border-white/5 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-foreground font-semibold text-lg tracking-tight">
          Orden #{orderId}
        </h2>
        {/* Uso del badge documentado en MD con color auxiliar naranja para estado pendiente */}
        <div className="bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
          <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider">
            Pendiente de Firma
          </span>
        </div>
      </div>

      {/* Balance Section */}
      <div className="mb-6 flex flex-col items-center">
        <div className="text-4xl font-bold tracking-tight text-foreground mb-1 num-tabular">
          {btcAmount} BTC
        </div>
        <div className="text-muted-foreground text-sm font-medium num-tabular opacity-80">
          ~ ${usdValue} USD
        </div>
      </div>

      <div className="h-px w-full bg-border mb-6" />

      {/* Progress (M-of-N Stepper) */}
      <div className="mb-8">
        <h3 className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-center opacity-70">
          Firmas: <span className="text-primary num-tabular">{signaturesAcquired}</span> / <span className="num-tabular">{signaturesRequired}</span>
        </h3>
        <div className="flex justify-between items-center px-2">
          
          {/* Comprador (Signed) */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(54,214,158,0.2)]">
              <Check className="text-primary w-5 h-5" />
            </div>
            <span className="text-primary text-[10px] font-bold uppercase tracking-wider">Comprador</span>
          </div>

          {/* Connector Line */}
          <div className="flex-1 h-px bg-border mx-2 mt-[-20px]" />

          {/* Vendedor (Pending) */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/[0.03] border-2 border-dashed border-orange-500/50 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.1)]">
              <Edit2 className="text-orange-500 w-4 h-4" />
            </div>
            <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Vendedor</span>
          </div>

          {/* Connector Line */}
          <div className="flex-1 h-px bg-border mx-2 mt-[-20px]" />

          {/* Árbitro (Inactive) */}
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <Gavel className="text-muted-foreground w-4 h-4" />
            </div>
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Árbitro</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <Button 
        onClick={onSignAction}
        className="w-full flex justify-center items-center gap-2"
        size="lg"
      >
        <PenTool className="w-4 h-4" />
        Firmar Transacción (PSBT)
      </Button>

      <div className="mt-4 text-center">
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          Sovereign Node Protocol
        </span>
      </div>
    </div>
  );
}
