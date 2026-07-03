import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-gradient mb-12">YieldSense AI</h2>
        <nav className="flex flex-col gap-4">
          <a href="#" className="p-3 bg-white/10 rounded-xl text-white font-medium">Dashboard</a>
          <a href="#" className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">Farm Data</a>
          <a href="#" className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">Weather</a>
          <a href="#" className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="flex justify-between items-center mb-10 relative z-10">
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <div className="flex items-center gap-4 glass px-4 py-2 rounded-full">
            <span className="text-slate-300 font-medium">Welcome, John Doe</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500"></div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
          <div className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform">
            <h3 className="text-slate-400 text-sm font-medium">Predicted Yield</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">1,250 <span className="text-lg text-slate-500 font-normal">kg/ha</span></p>
          </div>
          <div className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform">
            <h3 className="text-slate-400 text-sm font-medium">Avg Soil Moisture</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">32<span className="text-lg text-slate-500 font-normal">%</span></p>
          </div>
          <div className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform">
            <h3 className="text-slate-400 text-sm font-medium">Upcoming Rainfall</h3>
            <p className="text-3xl font-bold text-purple-400 mt-2">12 <span className="text-lg text-slate-500 font-normal">mm (Next 3 Days)</span></p>
          </div>
        </div>

        {/* Data Chart Placeholder */}
        <div className="glass-dark p-8 rounded-3xl h-80 flex flex-col items-center justify-center relative z-10 border border-white/5">
          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <p className="text-slate-400 text-lg font-medium">Yield Forecast Chart</p>
          <p className="text-slate-600 text-sm mt-1">Visualization component to be implemented in Milestone 2</p>
        </div>
      </main>
    </div>
  );
}
