# Especificaciones de Diseño: Marketplace Multisig Bitcoin

> Documento de extensión para adaptar el sistema de diseño base a flujos de transacciones con Escrow 2-de-3 en la red de Bitcoin.

---

## 1. Mapeo Semántico de Colores (Flujo Escrow)

Para mantener la coherencia visual con la estética "dark-first", los tokens de color del sistema de diseño se asignan a los siguientes estados del contrato multifirma:

* **Estados Pendientes (Espera de firma / Fondeo on-chain):**
    * Token: `orange-500` (Bitcoin Orange).
    * Uso: Insignias de estado, bordes de contenedores en espera, íconos de nodos pendientes.
* **Estados de Éxito (Firmado / Ejecutado):**
    * Token: `var(--primary)` (Mint Green).
    * Uso: Botones principales de acción ("Firmar PSBT"), checks de validación, progreso completado.
* **Estados de Disputa (Intervención de Árbitro / Cancelación):**
    * Token: `var(--destructive)` (Red-500).
    * Uso: Alertas, botones de cancelación, textos de error de red.
* **Metadatos y Datos Técnicos:**
    * Token: `var(--muted-foreground)`.
    * Uso: Hashes de transacciones (TXID), direcciones, fees (sats/vB), timestamps.

---

## 2. Anatomía de Componentes Core (Multisig)

### 2.1 Tarjeta de Estado del Escrow (`EscrowStatusCard`)
El contenedor principal que resume el intercambio.
* **Contenedor:** Uso de `bg-card border border-border rounded-xl p-5`.
* **Encabezado:** Título de la orden alineado a la izquierda, y un `Badge` de estado a la derecha.
* **Cuerpo:** Monto destacado utilizando la clase tipográfica `text-3xl font-bold tracking-tight` (ej. `0.05 BTC`), seguido del equivalente fiat en `text-muted-foreground`.

### 2.2 Indicador M-of-N (`SignatureStepper`)
Visualizador gráfico de las firmas requeridas (ej. 2-de-3).
* **Layout:** Contenedor `flex items-center gap-3`.
* **Nodo Firmado:** Círculo relleno `bg-primary/20 text-primary` con ícono de check.
* **Nodo Pendiente:** Círculo con borde `border border-orange-500 border-dashed text-orange-500`.
* **Nodo Inactivo (Árbitro):** Círculo `bg-muted text-muted-foreground`.

### 2.3 Insignias de Red y Rol (`RoleBadge`)
Indicadores rápidos para el contexto del usuario en la transacción.
* **Rol Comprador/Vendedor:** `Badge variant="outline"` con texto en `foreground`.
* **Red:** `Badge` con punto parpadeante (`animate-pulse`) indicando si es `Mainnet`, `Testnet` o `Signet`.

---

## 3. Prompt Maestro para Antigravity

*Copia este bloque y ejecútalo en tu interfaz de Antigravity junto con la referencia al archivo de diseño base.*

> **Directiva de Contexto:** Por favor, lee atentamente el archivo `@design-system-guidelines.md` para extraer las variables CSS y la configuración de Tailwind v4.
>
> **Rol:** Eres un desarrollador Frontend experto en React y Tailwind v4, especializado en dApps y Web3.
>
> **Tarea:** Construye el componente `MultisigEscrowCard` para un marketplace descentralizado. Este componente mostrará el estado en tiempo real de una transacción multifirma 2-de-3.
>
> **Estructura Requerida:**
> 1. **Header:** Título (ej. "Orden #4092") y un `Badge` a la derecha indicando "Pendiente de Firma" con color `orange-500`.
> 2. **Body:** Texto principal con el monto bloqueado (ej. "0.15000000 BTC") y un subtítulo en `muted-foreground` con su valor en USD.
> 3. **Stepper M-of-N:** Bloque visual "1 de 2 Firmas". Usa íconos de Lucide. El rol que ya firmó debe usar color primary. El rol pendiente debe usar `orange-500`.
> 4. **Footer:** Botón de acción principal (`variant="default"`) con el texto "Firmar Transacción".
>
> **Restricciones:**
> * Solo utiliza las clases, tokens semánticos (ej. `bg-card`, `border-border`) y la función `cn()` documentados.
> * El diseño debe coincidir exactamente con el sistema "dark-first" del documento base.
>
> **Salida:** Genera el código en TypeScript/React y guárdalo en `src/components/multisig/MultisigEscrowCard.tsx`.