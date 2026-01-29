import React from 'react';
import { Facebook, Instagram, MapPin, Phone, Clock } from 'lucide-react';
import { KiwiLogo } from './KiwiLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8" id="location">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="neon-glow rounded-full">
                <KiwiLogo className="w-10 h-10" />
              </div>
              <span className="text-2xl font-bold text-white">KIWI<span className="text-lime-500 font-light">NATURAL</span></span>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Fusionamos la naturaleza con la tecnología para ofrecerte los alimentos más frescos, nutritivos y deliciosos.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/kiwinatural/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-lime-500 hover:text-black transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-lime-500 hover:text-black transition-all">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide">CONTACTO</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-zinc-400">
                <MapPin className="text-lime-500 shrink-0 mt-1" size={20} />
                <span>Visit us at our location<br/>(Check Facebook for latest address)</span>
              </li>
              <li className="flex items-center gap-4 text-zinc-400">
                <Phone className="text-lime-500 shrink-0" size={20} />
                <span>+52 123 456 7890</span>
              </li>
              <li className="flex items-start gap-4 text-zinc-400">
                <Clock className="text-lime-500 shrink-0 mt-1" size={20} />
                <div>
                  <p>Lun - Vie: 8:00 AM - 8:00 PM</p>
                  <p>Sáb - Dom: 9:00 AM - 5:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide">MANTENTE SALUDABLE</h3>
            <p className="text-zinc-400 mb-4 text-sm">Recibe tips de nutrición y ofertas especiales.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu correo" 
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white w-full focus:outline-none focus:border-lime-500 transition-colors"
              />
              <button className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-6 py-3 rounded-lg transition-colors">
                GO
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 text-center text-zinc-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Kiwi Natural. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;