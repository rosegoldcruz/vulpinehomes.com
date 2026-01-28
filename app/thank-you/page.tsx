"use client";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Thanks
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
          We got your request and will contact you shortly
        </p>
      </div>
    </main>
  );
}
