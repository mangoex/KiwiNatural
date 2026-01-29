import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#09090b] border-l border-zinc-800 z-[70] transform transition-transform duration-300 ease-out shadow-2xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-lime-500" />
              <h2 className="text-xl font-bold text-white">Tu Orden</h2>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p>Tu carrito está vacío.</p>
                <button onClick={onClose} className="text-lime-500 hover:underline">Ir al Menú</button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                      <button onClick={() => onRemove(item.id)} className="text-zinc-500 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-lime-400 font-mono text-sm mb-3">${item.price * item.quantity}</p>
                    
                    <div className="flex items-center gap-3 bg-black/40 w-fit px-2 py-1 rounded-lg border border-white/10">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:text-lime-400 text-white transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center text-white">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:text-lime-400 text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-400">Total</span>
              <span className="text-3xl font-bold text-white font-mono">${total}</span>
            </div>
            <button 
              className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={items.length === 0}
              onClick={() => alert("¡Gracias por tu pedido! Esta es una demo.")}
            >
              PROCEDER AL PAGO
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
