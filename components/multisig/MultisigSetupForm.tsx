import React, { useEffect, useState } from 'react';
import { Plug, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMultisigStore } from '@/store/useMultisigStore';

export function MultisigSetupForm() {
  const { 
    contractParams, 
    generateContract, 
    connectWallet, 
    isLoading, 
    error 
  } = useMultisigStore();
  
  const [amount, setAmount] = useState('0.001');
  const [timelock, setTimelock] = useState('144');

  // Local state for non-wallet inputs if user wants to type manually
  const [localBuyerPub, setLocalBuyerPub] = useState('');
  const [localSellerPub, setLocalSellerPub] = useState('');

  // Sincronizar local state con el store cuando la wallet se conecta
  useEffect(() => {
    if (contractParams.buyerPubkey) setLocalBuyerPub(contractParams.buyerPubkey);
  }, [contractParams.buyerPubkey]);

  useEffect(() => {
    if (contractParams.sellerPubkey) setLocalSellerPub(contractParams.sellerPubkey);
  }, [contractParams.sellerPubkey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localBuyerPub || !localSellerPub) return;
    
    await generateContract(
      localBuyerPub, 
      localSellerPub, 
      Math.floor(parseFloat(amount) * 100_000_000), // BTC to Sats
      parseInt(timelock)
    );
  };

  return (
    <div className="w-full max-w-md glass-panel rounded-2xl p-8 shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
          Configuración del Contrato
        </h1>
        <p className="text-sm text-muted-foreground">
          Conecta tus wallets o ingresa las llaves públicas comprimidas
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Comprador */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-foreground uppercase tracking-wider">
            Comprador (Keys)
          </label>
          <div className="flex gap-2">
            <Input
              value={localBuyerPub}
              onChange={(e) => setLocalBuyerPub(e.target.value)}
              placeholder="02… or 03…"
              className="font-mono flex-1 h-11 bg-white/[0.03] border-white/10 focus:border-primary/50 transition-all"
              required
              autoComplete="off"
              spellCheck={false}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => connectWallet('buyer')}
              disabled={isLoading}
              className="h-11 w-11 p-0 shrink-0 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Connect Buyer Wallet"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plug className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Vendedor */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-foreground uppercase tracking-wider">
            Vendedor (Keys)
          </label>
          <div className="flex gap-2">
            <Input
              value={localSellerPub}
              onChange={(e) => setLocalSellerPub(e.target.value)}
              placeholder="02… or 03…"
              className="font-mono flex-1 h-11 bg-white/[0.03] border-white/10 focus:border-primary/50 transition-all"
              required
              autoComplete="off"
              spellCheck={false}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => connectWallet('seller')}
              disabled={isLoading}
              className="h-11 w-11 p-0 shrink-0 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Connect Seller Wallet"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plug className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Amount & Timelock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-foreground uppercase tracking-wider">
              Monto (BTC)
            </label>
            <Input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-foreground uppercase tracking-wider">
              Timelock (Bloques)
            </label>
            <Input
              type="number"
              value={timelock}
              onChange={(e) => setTimelock(e.target.value)}
              className="h-11 bg-white/[0.03] border-white/10 focus:border-primary/50"
              required
              autoComplete="off"
            />
          </div>
        </div>

        {/* Árbitro (Fijo por ahora) */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-medium text-foreground uppercase tracking-wider">
              Árbitro
            </label>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
              Red de Redes
            </span>
          </div>
          <div className="flex gap-2 opacity-70">
            <Input
              value="0295843b67975878415d862f1c8418f…"
              disabled
              className="font-mono flex-1 h-11 bg-secondary/50 text-muted-foreground/60 cursor-not-allowed border-white/5"
              readOnly
            />
            <Button 
              type="button" 
              variant="outline" 
              disabled
              className="h-11 w-11 p-0 shrink-0 bg-secondary"
            >
              <Lock className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading || !localBuyerPub || !localSellerPub}
            className="w-full font-bold relative"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Procesando…
              </span>
            ) : (
              'Generar Contrato de Escrow'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
