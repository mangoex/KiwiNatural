import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lime-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400 text-xs font-bold tracking-widest mb-6 backdrop-blur-md">
          ALIMENTACIÓN DEL FUTURO
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-8 tracking-tighter">
          COMIDA <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500 neon-text">NATURAL</span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Experimenta la fusión perfecta entre ingredientes frescos y nutrición avanzada. 
          Diseñado para tu bienestar, preparado para tu deleite.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <a 
            href="#menu"
            className="group relative px-8 py-4 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-full transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.4)] flex items-center gap-2"
          >
            ORDENAR AHORA
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="https://www.facebook.com/kiwinatural/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full backdrop-blur-sm border border-white/10 transition-colors"
          >
            VISITAR FACEBOOK
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;