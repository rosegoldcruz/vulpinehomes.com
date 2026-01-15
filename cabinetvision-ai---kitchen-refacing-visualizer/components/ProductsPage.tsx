
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
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Explore the five signature Vulpine lines, precision-engineered for every aesthetic.</p>
        </div>

        <div className="space-y-12">
          <div className="relative flex justify-center">
            <img src="/everything-visualized/doors.png" alt="Vulpine Door Styles" className="max-w-full h-auto" />
            
            {/* Clickable door areas positioned over each door */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="relative w-full max-w-5xl h-full">
                {DOOR_STYLES.map((style, index) => (
                  <button
                    key={style.id}
                    onClick={() => onSelectStyle(style.id)}
                    className="absolute cursor-pointer hover:opacity-30 transition-opacity bg-transparent hover:bg-black/20"
                    style={{
                      left: `${2 + index * 19}%`,
                      top: '25%',
                      width: '18%',
                      height: '50%'
                    }}
                    title={style.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Door Style Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {DOOR_STYLES.map((style) => (
              <div key={style.id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{style.name}</h3>
                    <span className="bg-orange-50 text-[#f07c3c] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Premium</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">{style.desc}</p>
                  <button 
                    onClick={() => onSelectStyle(style.id)}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#f07c3c] transition-colors"
                  >
                    Configure This Series
                  </button>
                </div>
              </div>
            ))}
          </div>
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
