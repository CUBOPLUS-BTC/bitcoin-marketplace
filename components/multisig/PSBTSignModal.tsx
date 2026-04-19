import React from 'react';
import { X, AlertTriangle, Copy, Usb, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PSBTSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  minerFee: string;
  totalOutput: string;
  destinationAddress: string;
  isSigning?: boolean;
}

export function PSBTSignModal({
  isOpen,
  onClose,
  onSign,
  minerFee,
  totalOutput,
  destinationAddress,
  isSigning = false,
}: PSBTSignModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/40 backdrop-blur-md z-50 flex items-center justify-center p-4 overscroll-behavior-contain">
      {/* Modal Card */}
      <div className="glass-panel w-full max-w-lg rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Revisar y Firmar PSBT
          </h2>
          <button 
            onClick={onClose}
            disabled={isSigning}
            className="text-muted-foreground hover:text-primary transition-colors focus:outline-none rounded-full p-1 disabled:opacity-30"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-2 space-y-6 flex-grow">
          {/* Summary Box */}
          <div className="bg-secondary/30 rounded-lg p-5 border border-border">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                <span className="text-sm text-muted-foreground">Miner Fee</span>
                <span className="font-mono text-sm text-foreground num-tabular">{minerFee}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Monto a Liberar</span>
                <span className="text-2xl font-bold tracking-tight text-foreground num-tabular">
                  {totalOutput} <span className="text-muted-foreground text-lg font-normal">BTC</span>
                </span>
              </div>
            </div>
          </div>

          {/* Alert Box */}
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 flex items-start space-x-3">
            <AlertTriangle className="text-orange-500 shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-xs text-orange-500 leading-relaxed font-medium">
              Asegúrate de que la dirección de destino en tu wallet coincida con la mostrada abajo para evitar ataques de sustitución.
            </p>
          </div>

          {/* Destination Preview */}
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Dirección de Destino
            </span>
            <div 
              onClick={() => {
                navigator.clipboard.writeText(destinationAddress);
              }}
              className="bg-background rounded-md px-3 py-2 border border-border flex justify-between items-center group cursor-pointer hover:border-primary/50 transition-colors"
            >
              <span className="font-mono text-xs text-foreground truncate pr-4">
                {destinationAddress}
              </span>
              <Copy className="text-muted-foreground group-hover:text-primary transition-colors w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-secondary/10 p-6 border-t border-border flex justify-end items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isSigning}
          >
            Cancelar
          </Button>
          <Button 
            variant="default" 
            onClick={onSign} 
            disabled={isSigning}
            className="flex items-center gap-2 min-w-[160px]"
          >
            {isSigning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> 
                Firmando…
              </>
            ) : (
              <>
                Confirmar y Firmar
                <Usb className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
