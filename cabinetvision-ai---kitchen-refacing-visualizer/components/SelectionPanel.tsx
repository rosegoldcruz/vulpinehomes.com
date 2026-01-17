
import React, { useMemo, useState } from 'react';
import { DoorStyle, UserSelections, FinishOption } from '../types';
import { FINISH_OPTIONS, HARDWARE_CATALOG, DOOR_STYLES } from '../constants';

interface SelectionPanelProps {
  selections: UserSelections;
  onChange: (updates: Partial<UserSelections>) => void;
  onVisualize: () => void;
  isLoading: boolean;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({ selections, onChange, onVisualize, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'door' | 'finish' | 'hardware'>('door');

  const availableFinishes = useMemo(() => {
    return FINISH_OPTIONS.filter(f => f.availableFor.includes(selections.doorStyle));
  }, [selections.doorStyle]);

  const selectedHardware = useMemo(() => {
    return HARDWARE_CATALOG.find(h => h.name === selections.hardwareStyle) || HARDWARE_CATALOG[0];
  }, [selections.hardwareStyle]);

  const handleDoorChange = (style: DoorStyle) => {
    const finishesForStyle = FINISH_OPTIONS.filter(f => f.availableFor.includes(style));
    const currentFinishValid = finishesForStyle.find(f => f.id === selections.finish.id);
    
    onChange({ 
      doorStyle: style,
      finish: currentFinishValid || finishesForStyle[0]
    });
    // Optional: Auto-advance if you prefer, currently removed to let them see selection
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 flex-shrink-0">
        {[
          { id: 'door', label: '1. Style' },
          { id: 'finish', label: '2. Color' },
          { id: 'hardware', label: '3. Hardware' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
        {/* DOOR SELECTION */}
        {activeTab === 'door' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight sticky top-0 bg-white z-10 py-2">Select Door Profile</h3>
            <div className="grid grid-cols-1 gap-4">
              {DOOR_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleDoorChange(style.id)}
                  className={`relative group overflow-hidden rounded-2xl border-4 transition-all text-left h-32 ${
                    selections.doorStyle === style.id
                      ? 'border-[#f07c3c] shadow-lg scale-[1.02]' 
                      : 'border-white shadow-md hover:border-slate-200'
                  }`}
                >
                  <img src={style.image} alt={style.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-center">
                    <div className="font-black text-white text-lg uppercase leading-none mb-1">{style.name}</div>
                    <div className="text-[10px] text-white/80 font-medium max-w-[70%] leading-tight">{style.desc}</div>
                    {selections.doorStyle === style.id && (
                       <div className="absolute top-4 right-4 bg-[#f07c3c] text-white p-1 rounded-full">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setActiveTab('finish')}
              className="w-full py-4 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 mt-4"
            >
              Next: Finish &rarr;
            </button>
          </div>
        )}

        {/* FINISH SELECTION */}
        {activeTab === 'finish' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="sticky top-0 bg-white z-10 py-2 flex justify-between items-end border-b border-slate-50 pb-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Select Finish</h3>
              <span className="text-[10px] font-bold text-slate-400">
                {selections.doorStyle}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {availableFinishes.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => onChange({ finish })}
                  className={`flex items-center gap-3 p-2 rounded-xl border-2 transition-all group text-left ${
                    selections.finish.id === finish.id 
                      ? 'border-[#f07c3c] bg-orange-50/20' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-slate-200">
                    <img src={finish.texture} alt={finish.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase leading-none mb-1 ${selections.finish.id === finish.id ? 'text-[#f07c3c]' : 'text-slate-900'}`}>
                      {finish.name}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium leading-none">{finish.type}</div>
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setActiveTab('hardware')}
              className="w-full py-4 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 mt-4"
            >
              Next: Hardware &rarr;
            </button>
          </div>
        )}

        {/* HARDWARE SELECTION */}
        {activeTab === 'hardware' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight sticky top-0 bg-white z-10 py-2">Hardware</h3>
             
             <div className="space-y-6">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Style</label>
                 <div className="grid grid-cols-2 gap-3">
                   {HARDWARE_CATALOG.map(h => (
                     <button
                       key={h.id}
                       onClick={() => onChange({ hardwareStyle: h.name, hardwareFinish: h.finishes[0] })}
                       className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all group ${
                         selections.hardwareStyle === h.name 
                           ? 'border-[#f07c3c] shadow-lg scale-105 z-10' 
                           : 'border-white shadow-sm hover:border-slate-200'
                       }`}
                     >
                       <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                       <div className="absolute bottom-0 left-0 right-0 p-3">
                         <div className="text-white text-[10px] font-black uppercase">{h.name}</div>
                       </div>
                     </button>
                   ))}
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Finish</label>
                 <div className="flex flex-wrap gap-2">
                   {selectedHardware.finishes.map(f => (
                     <button
                       key={f}
                       onClick={() => onChange({ hardwareFinish: f })}
                       className={`px-4 py-3 rounded-lg text-[9px] font-black uppercase border-2 transition-all ${
                         selections.hardwareFinish === f 
                           ? 'border-slate-900 bg-slate-900 text-white shadow-lg' 
                           : 'border-slate-100 text-slate-400 hover:border-slate-300'
                       }`}
                     >
                       {f}
                     </button>
                   ))}
                 </div>
               </div>
             </div>
             
             <button
              onClick={onVisualize}
              disabled={isLoading}
              className={`w-full py-5 mt-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all ${
                isLoading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#f07c3c] text-white hover:bg-[#d96a2e] active:scale-[0.98]'
              }`}
            >
              {isLoading ? 'Processing...' : 'Apply Updates'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionPanel;
