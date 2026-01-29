import React, { useState } from 'react';
import { Category, MenuItem } from '../types';
import { MENU_ITEMS } from '../constants';
import { Plus, Info } from 'lucide-react';

interface MenuGridProps {
  onAddToCart: (item: MenuItem) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const categories = ['Todos', ...Object.values(Category)];
  
  const filteredItems = activeCategory === 'Todos' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 relative bg-[#09090b]">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">NUESTRO <span className="text-lime-500">MENÚ</span></h2>
          <div className="h-1 w-24 bg-lime-500 mx-auto rounded-full neon-glow"></div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 sticky top-24 z-30 py-4 glass-panel rounded-2xl md:bg-transparent md:glass-panel-none md:static">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as Category | 'Todos')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat 
                  ? 'bg-lime-500 text-black border-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.3)]' 
                  : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-lime-500/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-lime-500/30 transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent opacity-60"></div>
                {item.isPopular && (
                  <span className="absolute top-4 left-4 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded">
                    POPULAR
                  </span>
                )}
                <div className="absolute bottom-4 left-4">
                  <p className="text-lime-400 text-xs font-bold tracking-wider mb-1 uppercase">{item.category}</p>
                  <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4 h-10">{item.description}</p>
                
                <div className="flex items-end justify-between">
                  <div>
                     <p className="text-xs text-zinc-500 mb-1 font-mono">ENERGÍA</p>
                     <p className="text-white text-sm font-mono">{item.calories || 200} KCAL</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${item.price}</p>
                  </div>
                </div>

                {/* Add Button - Expands on hover */}
                <button
                  onClick={() => onAddToCart(item)}
                  className="mt-4 w-full bg-white/5 hover:bg-lime-500 hover:text-black border border-white/10 hover:border-lime-500 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(132,204,22,0.2)]"
                >
                  <Plus className="w-5 h-5" />
                  AGREGAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuGrid;
