
import React, { useState } from 'react';
import { UserSelections, DoorStyle, DrawerFront, VisualizerState } from './types';
import { FINISH_OPTIONS, HARDWARE_CATALOG } from './constants';
import { refaceCabinets } from './services/geminiService';
import Header from './components/Header';
import Uploader from './components/Uploader';
import SelectionPanel from './components/SelectionPanel';
import ComparisonSlider from './components/ComparisonSlider';

const App: React.FC = () => {
  const [selections, setSelections] = useState<UserSelections>({
    doorStyle: DoorStyle.SHAKER_CLASSIC,
    drawerFront: DrawerFront.MATCHING,
    finish: FINISH_OPTIONS.find(f => f.id === 'snow-white')!,
    hardwareStyle: HARDWARE_CATALOG[0].name,
    hardwareFinish: HARDWARE_CATALOG[0].finishes[0],
  });

  const [vizState, setVizState] = useState<VisualizerState>({
    originalImages: [],
    modifiedImages: {},
    currentImageIndex: 0,
    isLoading: false,
    error: null,
  });

  const handleUpload = (base64s: string[]) => {
    setVizState({
      originalImages: base64s,
      modifiedImages: {},
      currentImageIndex: 0,
      isLoading: false,
      error: null,
    });
  };

  const handleVisualize = async () => {
    if (vizState.originalImages.length === 0) return;
    
    // Visualize the CURRENTLY selected image only to save resources/time
    setVizState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const currentOriginal = vizState.originalImages[vizState.currentImageIndex];
      const result = await refaceCabinets(currentOriginal, selections);
      
      setVizState(prev => ({
        ...prev,
        modifiedImages: {
          ...prev.modifiedImages,
          [prev.currentImageIndex]: result
        },
        isLoading: false
      }));
    } catch (err) {
      setVizState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Visualization failed. Please ensure the photo is clear." 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf9] flex flex-col font-['Inter']">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 lg:px-8">
        <div className="max-w-[1400px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
          {vizState.originalImages.length === 0 ? (
            <div className="max-w-3xl mx-auto py-16 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Visualizer</h2>
                <p className="text-xl text-slate-500 font-medium">Upload photos of your existing kitchen to start.</p>
              </div>
              <Uploader onUpload={handleUpload} />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Left Column: Visualizer Window */}
              <div className="xl:col-span-8 space-y-6">
                <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden border-[12px] border-white ring-1 ring-slate-100">
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black">
                    {vizState.modifiedImages[vizState.currentImageIndex] ? (
                      <ComparisonSlider 
                        original={vizState.originalImages[vizState.currentImageIndex]} 
                        modified={vizState.modifiedImages[vizState.currentImageIndex]} 
                      />
                    ) : (
                      <div className="relative w-full h-full">
                          <img 
                            src={vizState.originalImages[vizState.currentImageIndex]} 
                            alt="Current View" 
                            className={`w-full h-full object-cover transition-all ${vizState.isLoading ? 'opacity-50 blur-sm scale-105' : 'opacity-80'}`} 
                          />
                          {vizState.isLoading ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white px-6">
                              <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-[#f07c3c]/30 rounded-full" />
                                <div className="absolute inset-0 border-4 border-[#f07c3c] border-t-transparent rounded-full animate-spin" />
                              </div>
                              <p className="font-black text-2xl tracking-tighter uppercase animate-pulse">Designing...</p>
                            </div>
                          </div>
                          ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <button onClick={handleVisualize} className="bg-[#f07c3c] text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-orange-500/50">
                                  Visualize This View
                                </button>
                              </div>
                          </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-4 overflow-x-auto pb-4 px-2">
                  {vizState.originalImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVizState(prev => ({ ...prev, currentImageIndex: idx }))}
                      className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${
                        vizState.currentImageIndex === idx 
                          ? 'border-[#f07c3c] shadow-lg scale-105' 
                          : 'border-white opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      {vizState.modifiedImages[idx] && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                      )}
                    </button>
                  ))}
                  <button 
                    onClick={() => setVizState({ originalImages: [], modifiedImages: {}, currentImageIndex: 0, isLoading: false, error: null })}
                    className="w-24 h-24 flex-shrink-0 rounded-2xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-[#f07c3c] hover:text-[#f07c3c] bg-white transition-colors"
                  >
                    <span className="text-2xl font-black">+</span>
                    <span className="text-[9px] font-black uppercase">New</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Configurator */}
              <div className="xl:col-span-4 sticky top-28 space-y-6">
                <SelectionPanel 
                  selections={selections} 
                  onChange={(u) => setSelections(prev => ({ ...prev, ...u }))} 
                  onVisualize={handleVisualize}
                  isLoading={vizState.isLoading}
                />
                
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Current Specification</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-500">Door</span>
                        <span className="text-xs font-black text-slate-900 uppercase">{selections.doorStyle}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-500">Color</span>
                        <span className="text-xs font-black text-slate-900 uppercase">{selections.finish.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-500">Hardware</span>
                        <span className="text-xs font-black text-slate-900 uppercase">{selections.hardwareStyle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
