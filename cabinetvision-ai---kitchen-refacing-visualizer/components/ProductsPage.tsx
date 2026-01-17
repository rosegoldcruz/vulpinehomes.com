
import React from 'react';
import { DoorStyle, UserSelections } from '../types';
import { DOOR_STYLES, FINISH_OPTIONS, HARDWARE_CATALOG } from '../constants';

interface ProductsPageProps {
  onSelectStyle: (style: DoorStyle) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onSelectStyle }) => {
  return (
    <div className="space-y-24 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Series Hero Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Our Cabinet Series</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Explore the four signature Vulpine lines, precision-engineered for every aesthetic.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {DOOR_STYLES.map((style) => (
            <div key={style.id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={style.image} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{style.name}</h3>
                  <span className="bg-orange-50 text-[#f07c3c] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Premium</span>
                </div>
                <p className="text-slate-500 text-lg leading-relaxed">{style.desc}</p>
                <button 
                  onClick={() => onSelectStyle(style.id)}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#f07c3c] transition-colors"
                >
                  Configure This Series
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Colors & Materials Section */}
      <section className="bg-slate-900 rounded-[4rem] p-16 text-white space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
           <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" /></svg>
        </div>
        <div className="text-center space-y-4 relative z-10">
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Vulpine Finish Palette</h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">From high-gloss modernism to organic wood grains, our finishes are built to last.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6 relative z-10">
          {FINISH_OPTIONS.map(f => (
            <div key={f.id} className="space-y-3 text-center">
              <div 
                className="w-full aspect-square rounded-3xl border-4 border-white/10 shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: f.hex }}
              >
                {f.type === 'Gloss' && <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/30" />}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{f.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hardware Section */}
      <section className="space-y-12 pb-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">The Hardware Lab</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Finish your project with high-quality pulls and knobs from our designer collection.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {HARDWARE_CATALOG.map(h => (
            <div key={h.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center space-y-4 hover:border-[#f07c3c] transition-colors cursor-default group">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">🛠️</span>
              </div>
              <h4 className="font-black text-slate-900 uppercase tracking-tight">{h.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">{h.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
