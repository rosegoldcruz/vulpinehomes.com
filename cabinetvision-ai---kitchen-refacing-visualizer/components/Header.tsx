
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-50 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-28 flex items-center justify-between">
        <div className="flex items-center gap-5 group cursor-default">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-200 group-hover:rotate-6 transition-transform duration-500">
            <span className="text-white font-black text-2xl">V</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-3xl text-slate-900 leading-none tracking-tighter uppercase">Vulpine</span>
            <span className="font-black text-[11px] text-[#f07c3c] tracking-[0.5em] leading-none uppercase mt-1">Homes</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden xl:block text-right">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Direct Support</p>
            <p className="text-base font-black text-slate-900 leading-none tracking-tight">(480) 364 8205</p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#f07c3c] transition-all shadow-xl shadow-slate-100 active:scale-95">
            Book Appointment
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
