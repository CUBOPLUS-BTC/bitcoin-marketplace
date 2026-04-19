import React from 'react';
import { History, CheckCircle2, AlertTriangle, Info, Clock, Check, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Tipos para estructurar la data
type EventType = 'success' | 'warning' | 'info';

interface DisputeEvent {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  type: EventType;
  txId?: string;
}

interface ArbitratorDeskProps {
  caseId: string;
  escrowBalance: string;
  events: DisputeEvent[];
  onReleaseToBuyer: () => void;
  onRefundToSeller: () => void;
}

export function ArbitratorDesk({
  caseId,
  escrowBalance,
  events,
  onReleaseToBuyer,
  onRefundToSeller
}: ArbitratorDeskProps) {
  
  // Helper para renderizar los íconos de la línea de tiempo según el tipo
  const renderEventIcon = (type: EventType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'info':
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEventStyle = (type: EventType) => {
    switch (type) {
      case 'success':
        return { dot: 'bg-primary ring-card', bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' };
      case 'warning':
        return { dot: 'bg-destructive ring-card', bg: 'bg-destructive/10', border: 'border-destructive/20', text: 'text-destructive' };
      case 'info':
        return { dot: 'bg-muted-foreground ring-card', bg: 'bg-secondary', border: 'border-border', text: 'text-muted-foreground' };
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Columna Izquierda: Historial de Eventos (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Encabezado del caso */}
        <div className="mb-4">
          <h2 className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2">
            Dispute Case #{caseId}
          </h2>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Contract Resolution
            </h1>
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              ACTIVE
            </Badge>
          </div>
        </div>

        {/* Tarjeta de Historial */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold tracking-tight text-foreground mb-6 flex items-center gap-2">
            <History className="text-muted-foreground w-5 h-5" />
            Historial de Eventos
          </h3>

          {/* Línea de tiempo */}
          <div className="relative pl-4 border-l border-border/50 space-y-8 py-2">
            {events.map((event) => {
              const styles = getEventStyle(event.type);
              
              return (
                <div key={event.id} className="relative">
                  {/* Punto de la línea de tiempo */}
                  <div className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ${styles.dot}`} />
                  
                  <div className="pl-6">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-medium ${event.type === 'warning' ? 'text-destructive' : 'text-foreground'}`}>
                        {event.title}
                      </h4>
                      <span className="text-xs text-muted-foreground font-mono">
                        {event.timestamp}
                      </span>
                    </div>
                    
                    <div className={`p-3 rounded-lg border mt-2 flex items-center gap-3 ${styles.bg} ${styles.border}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-background/50`}>
                        {renderEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs truncate ${event.type === 'warning' ? 'text-destructive/90' : 'text-muted-foreground'}`}>
                          {event.description}
                        </p>
                        {event.txId && (
                          <p className="text-[10px] text-muted-foreground/70 font-mono truncate mt-0.5">
                            Tx: {event.txId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Acciones del Veredicto (1/3 width) */}
      <div className="lg:col-span-1 mt-6 lg:mt-[76px]">
        
        {/* Tarjeta de Acción (Estado de espera) */}
        <div className="bg-card rounded-xl p-6 shadow-md relative overflow-hidden border border-orange-500/30">
          {/* Fondo sutil parpadeante para indicar acción pendiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-orange-500 animate-pulse w-5 h-5" />
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Emitir Veredicto
              </h3>
            </div>
            
            <div className="mb-8">
              <p className="text-xs text-muted-foreground mb-2">Escrow Balance</p>
              <p className="text-3xl font-bold tracking-tight text-foreground font-mono">
                {escrowBalance} <span className="text-lg text-muted-foreground">BTC</span>
              </p>
              <p className="text-[10px] text-orange-500 mt-2 tracking-wide uppercase font-medium">
                Awaiting Confirmations...
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={onReleaseToBuyer}
                className="w-full flex items-center justify-center gap-2 h-12"
              >
                <Check className="w-4 h-4" />
                Liberar fondos al Comprador
              </Button>
              
              {/* Botón destructivo personalizado */}
              <Button 
                onClick={onRefundToSeller}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-12 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Undo className="w-4 h-4" />
                Reembolsar al Vendedor
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
