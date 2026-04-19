import React, { useEffect, useState } from 'react';
import { Plug, Lock, Loader2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMultisigStore } from '@/store/useMultisigStore';

interface MultisigSetupFormProps {
  onGenerate?: () => void;
  priceBtc?: string;
  sellerPublicKey?: string;
}

export function MultisigSetupForm({ 
  onGenerate, 
  priceBtc = '0.001', 
  sellerPublicKey = '' 
}: MultisigSetupFormProps) {
  const { 
    contractParams, 
    generateContract, 
    connectWallet, 
    isLoading, 
    error 
  } = useMultisigStore();
  
  const [amount, setAmount] = useState(priceBtc);
  const [timelock, setTimelock] = useState('144');
  const [isAdvanced, setIsAdvanced] = useState(false);

  // Local state for non-wallet inputs
  const [localBuyerPub, setLocalBuyerPub] = useState('');
  const [localSellerPub, setLocalSellerPub] = useState(sellerPublicKey);

  // Sync props and store
  useEffect(() => {
    if (contractParams.buyerPubkey) setLocalBuyerPub(contractParams.buyerPubkey);
  }, [contractParams.buyerPubkey]);

  useEffect(() => {
    if (sellerPublicKey) setLocalSellerPub(sellerPublicKey);
  }, [sellerPublicKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localBuyerPub || !localSellerPub) return;
    
    const success = await generateContract(
      localBuyerPub, 
      localSellerPub, 
      Math.floor(parseFloat(amount) * 100_000_000), // BTC to Sats
      parseInt(timelock)
    );

    if (success && onGenerate) {
      onGenerate();
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-500">
      {/* Mini Header for Checkout Style */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            Checkout Seguro
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Bitcoin Escrow Protocool
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#f1eeaa]/10 rounded border border-[#ffb874]/20 animate-pulse">
           <ShieldCheck className="w-3.5 h-3.5 text-[#ffb874]" />
           <span className="text-[9px] font-bold text-[#ffb874] uppercase tracking-tighter">Secure 2-of-3</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-[10px] font-mono leading-tight">
          ERROR: {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Simplified Buyer Area */}
        <div className="space-y-4">
          <label className="block text-xs font-black text-zinc-300 uppercase tracking-widest">
            Tu Identidad Bitcoin (Comprador)
          </label>
          <div className="flex gap-2">
            <Input
              value={localBuyerPub}
              onChange={(e) => setLocalBuyerPub(e.target.value)}
              placeholder="Conecta tu wallet o ingresa Public Key..."
              className="font-mono flex-1 h-14 bg-zinc-950/60 border-zinc-800 text-zinc-100 text-sm focus:border-[#ffb874]/60 placeholder:text-zinc-600 shadow-inner px-4"
              required
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => connectWallet('buyer')}
              disabled={isLoading}
              className={`h-14 w-14 p-0 shrink-0 transition-all border-zinc-800 hover:border-[#ffb874]/50 hover:bg-[#ffb874]/10 ${localBuyerPub ? 'border-[#ffb874] text-[#ffb874]' : 'text-zinc-500'}`}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plug className="w-6 h-6" />}
            </Button>
          </div>
          {!localBuyerPub && (
             <p className="text-xs text-[#acaab0] italic font-medium px-1">
               * Requerido para firmar la liberación de fondos después de la entrega.
             </p>
          )}
        </div>

        {/* Informational Summary (Non-Advanced) */}
        {!isAdvanced && (
           <div className="p-5 bg-black/40 rounded-lg border border-zinc-800/50 space-y-4 shadow-lg">
              <div className="flex justify-between items-center">
                 <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Monto a Bloquear</span>
                 <span className="text-[#fe9821] font-black text-lg">{amount} BTC</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Garantía Arbitraje</span>
                 <span className="text-zinc-100 font-bold text-sm">Red de Redes (Satsy)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Protección de Tiempo</span>
                 <span className="text-zinc-100 font-bold text-sm">~24 Horas (144 Bloques)</span>
              </div>
           </div>
        )}

        {/* Advanced Settings Toggle */}
        <button 
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-[#ffb874] transition-colors"
        >
           {isAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
           {isAdvanced ? 'Ocultar Configuración' : 'Configuración Avanzada'}
        </button>

        {/* Advanced Fields */}
        {isAdvanced && (
          <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
             <div className="space-y-3">
                <label className="block text-xs font-black text-zinc-300 uppercase tracking-widest">Vendedor (Public Key)</label>
                <Input
                  value={localSellerPub}
                  onChange={(e) => setLocalSellerPub(e.target.value)}
                  className="font-mono h-12 bg-zinc-950/60 text-zinc-200 text-sm border-zinc-800 focus:border-[#ffb874]/40 px-4"
                  required
                />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="block text-xs font-black text-zinc-300 uppercase tracking-widest">Monto (BTC)</label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-12 bg-zinc-950/60 text-zinc-200 text-sm border-zinc-800 px-4"
                    />
                </div>
                <div className="space-y-3">
                    <label className="block text-xs font-black text-zinc-300 uppercase tracking-widest">Timelock</label>
                    <Input
                      type="number"
                      value={timelock}
                      onChange={(e) => setTimelock(e.target.value)}
                      className="h-12 bg-zinc-950/60 text-zinc-200 text-sm border-zinc-800 px-4"
                    />
                </div>
             </div>

             <div className="p-4 bg-zinc-900/50 rounded border border-zinc-800/30">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-2">
                   <Lock className="w-4 h-4 text-[#ffb874]/60" /> Árbitro Red de Redes Activo
                </p>
             </div>
          </div>
        )}

        {/* Big Action Button */}
        <div className="pt-2">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading || !localBuyerPub || !localSellerPub}
            className={`w-full min-h-[64px] py-4 px-6 font-black text-sm uppercase tracking-[0.15em] leading-tight flex items-center justify-center text-center relative overflow-hidden transition-all duration-500
              ${localBuyerPub && localSellerPub 
                ? 'bg-[#ffb874] text-[#613500] hover:bg-[#ffaa55] shadow-[0_0_30px_rgba(255,184,116,0.4)] border-none' 
                : 'bg-zinc-900 text-zinc-600 border border-zinc-800 opacity-60 cursor-not-allowed'}
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" /> 
                <span className="whitespace-nowrap">Generando Vault...</span>
              </div>
            ) : (
              <span className="whitespace-normal">Confirmar & Abrir Escrow</span>
            )}
          </Button>
          <p className="text-[8px] text-zinc-600 text-center mt-4 font-bold uppercase tracking-tighter">
             Powered by Bitcoin Multisig Protocol 2.1
          </p>
        </div>
      </form>
    </div>
  );
}
