import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import NutriPlanner from './components/NutriPlanner';
import { CartItem, MenuItem } from './types';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'planner'>('home');

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-lime-500 selection:text-black">
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        onPlannerClick={() => setCurrentView('planner')}
        onHomeClick={() => setCurrentView('home')}
      />
      
      <main>
        {currentView === 'home' ? (
          <>
            <Hero />
            <MenuGrid onAddToCart={handleAddToCart} />
            
            {/* Features Section */}
            <section className="py-20 bg-zinc-900/30" id="about">
              <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-lime-500/30 transition-all group">
                  <div className="w-16 h-16 mx-auto mb-6 bg-lime-500/10 rounded-2xl flex items-center justify-center group-hover:bg-lime-500 transition-colors">
                    <span className="text-3xl">🌿</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">100% Natural</h3>
                  <p className="text-zinc-400">Ingredientes seleccionados diariamente para garantizar la máxima frescura y nutrición.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-lime-500/30 transition-all group">
                  <div className="w-16 h-16 mx-auto mb-6 bg-lime-500/10 rounded-2xl flex items-center justify-center group-hover:bg-lime-500 transition-colors">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Energía Pura</h3>
                  <p className="text-zinc-400">Recetas balanceadas diseñadas para potenciar tu rendimiento físico y mental.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-lime-500/30 transition-all group">
                  <div className="w-16 h-16 mx-auto mb-6 bg-lime-500/10 rounded-2xl flex items-center justify-center group-hover:bg-lime-500 transition-colors">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Sin Conservadores</h3>
                  <p className="text-zinc-400">Comprometidos con tu salud, cero aditivos químicos en nuestras preparaciones.</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <NutriPlanner onAddToCart={handleAddToCart} />
        )}
      </main>

      <Footer />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />
    </div>
  );
};

export default App;