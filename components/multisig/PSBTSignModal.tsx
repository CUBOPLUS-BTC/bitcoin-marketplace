import React from 'react';
import { X, ShieldCheck, Copy, Cpu, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overscroll-behavior-contain">
      {/* Modal Card */}
      <div className="glass-panel w-full max-w-lg rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-white/10">
        
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#ffb874]/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#ffb874]/5 blur-[100px] rounded-full"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4 relative">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#e7e4ea]">
              Autorizar Firma PSET
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#acaab0] mt-1">
              Liquid Layer 2 Transaction
            </p>
          </div>
          <button 
            onClick={onClose}
            disabled={isSigning}
            className="text-zinc-500 hover:text-[#ffb874] transition-colors focus:outline-none rounded-full p-1 disabled:opacity-30"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 pt-2 space-y-6 flex-grow relative">
          {/* Summary Box */}
          <div className="bg-black/40 rounded-xl p-6 border border-zinc-800/50 shadow-inner">
            <div className="space-y-5">
              <div className="flex justify-between items-baseline border-b border-zinc-800/50 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Miner Fee (L2)</span>
                <span className="font-mono text-sm text-[#ffb874] num-tabular">{minerFee}</span>
              </div>
              <div className="flex flex-col space-y-1 py-1">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Operación de Escrow</span>
                <span className="text-3xl font-black tracking-tighter text-[#e7e4ea] num-tabular">
                  {totalOutput}
                </span>
                <p className="text-[10px] text-zinc-500 font-medium">Libere los fondos mediante firma criptográfica de elementos.</p>
              </div>
            </div>
          </div>

          {/* Alert Box */}
          <div className="rounded-xl border border-[#ffb874]/20 bg-[#ffb874]/5 p-5 flex items-start space-x-4">
            <ShieldCheck className="text-[#ffb874] shrink-0 w-6 h-6" />
            <p className="text-xs text-[#e7e4ea]/80 leading-relaxed font-medium">
              Usted está autorizando la liberación de activos en una dirección multifirma 2-de-3 coordinada por el protocolo. Verifique los detalles antes de proceder.
            </p>
          </div>

          {/* Destination Preview */}
          <div className="flex flex-col space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
              Identificador de Destino
            </span>
            <div 
              onClick={() => {
                navigator.clipboard.writeText(destinationAddress);
              }}
              className="bg-[#131316] rounded-lg px-4 py-3 border border-zinc-800 flex justify-between items-center group cursor-pointer hover:border-[#ffb874]/30 transition-all shadow-inner"
            >
              <span className="font-mono text-[10px] text-zinc-400 truncate pr-4">
                {destinationAddress}
              </span>
              <Copy className="text-zinc-600 group-hover:text-[#ffb874] transition-colors w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-black/20 p-8 border-t border-zinc-800 flex justify-end items-center space-x-6 relative">
          <button 
            onClick={onClose}
            disabled={isSigning}
            className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-30"
          >
            Abortar
          </button>
          <Button 
            onClick={onSign} 
            disabled={isSigning}
            className="flex items-center gap-3 min-w-[200px] h-14 bg-[#ffb874] text-[#613500] font-black uppercase tracking-widest text-xs hover:bg-[#ffaa55] shadow-[0_0_20px_rgba(255,184,116,0.2)] border-none"
          >
            {isSigning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> 
                Firmando...
              </>
            ) : (
              <>
                Autorizar Firmas
                <Cpu className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
