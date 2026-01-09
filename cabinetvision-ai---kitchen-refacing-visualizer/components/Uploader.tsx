import React, { useRef } from 'react';

interface UploaderProps {
  onUpload: (base64s: string[]) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const promises: Promise<string>[] = [];
    
    Array.from(files).forEach((file: File) => {
      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
      promises.push(promise);
    });

    Promise.all(promises).then(base64s => {
      onUpload(base64s);
    });
  };

  return (
    <div 
      className="border-2 border-dashed border-slate-300 rounded-[3rem] p-16 text-center bg-white hover:border-[#f07c3c] hover:bg-orange-50/10 transition-all cursor-pointer group"
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple
        onChange={handleFileChange} 
      />
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#f07c3c] group-hover:text-white transition-all duration-300">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Upload Your Kitchen Photos</h3>
          <p className="text-slate-500 font-medium">Select multiple angles to visualize the full transformation.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#f07c3c] transition-colors shadow-lg">
          Select Photos
        </button>
      </div>
    </div>
  );
};

export default Uploader;