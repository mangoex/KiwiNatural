import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Activity } from 'lucide-react';
import { KiwiLogo } from './KiwiLogo';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onPlannerClick: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onPlannerClick, onHomeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 glass-panel border-b border-lime-500/20' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { onHomeClick(); window.scrollTo(0,0); }}>
          <div className="relative group-hover:scale-110 transition-transform duration-300">
             <div className="absolute inset-0 bg-lime-500 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
             <KiwiLogo className="relative w-12 h-12 shadow-xl" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white group-hover:text-lime-400 transition-colors">
            KIWI<span className="text-lime-500 font-light">NATURAL</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-zinc-400">
          <button onClick={onHomeClick} className="hover:text-lime-400 transition-colors">MENÚ</button>
          <button onClick={onPlannerClick} className="flex items-center gap-1 text-lime-500 hover:text-white transition-colors">
            <Activity size={16} /> NUTRIPLANNER
          </button>
          <a href="#about" onClick={onHomeClick} className="hover:text-lime-400 transition-colors">NOSOTROS</a>
          <a href="#location" onClick={onHomeClick} className="hover:text-lime-400 transition-colors">UBICACIÓN</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onCartClick}
            className="relative p-3 rounded-full hover:bg-white/10 transition-colors group"
          >
            <ShoppingBag className="w-6 h-6 text-white group-hover:text-lime-400" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-lime-500 text-black text-xs font-bold flex items-center justify-center rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel absolute top-full left-0 w-full p-4 flex flex-col gap-4 border-t border-white/10">
          <button onClick={() => { onHomeClick(); setMobileMenuOpen(false); }} className="text-lg text-left text-white hover:text-lime-400">Menú</button>
          <button onClick={() => { onPlannerClick(); setMobileMenuOpen(false); }} className="text-lg text-left text-lime-500 font-bold hover:text-white">NutriPlanner Pro</button>
          <button onClick={() => { onHomeClick(); setMobileMenuOpen(false); }} className="text-lg text-left text-white hover:text-lime-400">Nosotros</button>
          <button onClick={() => { onHomeClick(); setMobileMenuOpen(false); }} className="text-lg text-left text-white hover:text-lime-400">Ubicación</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
