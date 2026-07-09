"use client";
import React, { useState } from 'react';

export default function DepartmentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subsidies, setSubsidies] = useState([
    { id: 1, region: 'Region A', crop: 'Wheat', amount: '$45,000', status: 'Distributed' },
    { id: 2, region: 'Region B', crop: 'Corn', amount: '$32,000', status: 'Distributed' },
    { id: 3, region: 'Region C', crop: 'Rice', amount: '$50,000', status: 'Pending Review' },
  ]);

  const approveSubsidy = (id: number) => {
    setSubsidies(subsidies.map(s => s.id === id ? { ...s, status: 'Distributed' } : s));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-gradient mb-12">YieldSense AI</h2>
        <nav className="flex flex-col gap-4">
          <button onClick={() => setActiveTab('dashboard')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Regional Analytics
          </button>
          <button onClick={() => setActiveTab('subsidies')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'subsidies' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Yield Subsidies
          </button>
          <button onClick={() => setActiveTab('performance')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'performance' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Crop Performance
          </button>
          <a href="/login" className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto text-left">
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-3xl font-bold">
              {activeTab === 'dashboard' && "Agriculture Department Portal"}
              {activeTab === 'subsidies' && "Subsidy Distribution Ledger"}
              {activeTab === 'performance' && "Crop Seasonal Distribution Performance"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === 'dashboard' && "Monitor regional harvest performance and manage seasonal crop distributions."}
              {activeTab === 'subsidies' && "Allocate and approve fertilizer and crop subsidies based on yield performance."}
              {activeTab === 'performance' && "Compare production yields across primary crop types and regions."}
            </p>
          </div>
          <div className="flex items-center gap-4 glass px-4 py-2 rounded-full">
            <span className="text-slate-300 font-medium">Welcome, Director</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500"></div>
          </div>
        </header>

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Total Regional Yield</h3>
                <p className="text-3xl font-bold text-amber-500 mt-2">42,500 <span className="text-lg text-slate-500 font-normal">Tons</span></p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Active Subsidy Budget</h3>
                <p className="text-3xl font-bold text-green-400 mt-2">$1.2M <span className="text-lg text-slate-500 font-normal">USD</span></p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Primary Crop Profile</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">Wheat <span className="text-lg text-slate-500 font-normal">(42% share)</span></p>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-3xl h-80 flex flex-col items-center justify-center border border-white/5">
              <p className="text-slate-400 text-lg font-medium">Regional Yield Density Maps (Milestone 2)</p>
              <p className="text-slate-600 text-sm mt-1">Geo-heatmaps and crop performance data charts will load here.</p>
            </div>
          </div>
        )}

        {/* Tab 2: Subsidies */}
        {activeTab === 'subsidies' && (
          <div className="glass p-8 rounded-3xl border border-white/5 relative z-10 overflow-x-auto">
            <h3 className="text-xl font-bold mb-6">Regional Support allocations</h3>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-4">Region</th>
                  <th className="py-4">Target Crop</th>
                  <th className="py-4">Financial Support</th>
                  <th className="py-4">Ledger Status</th>
                  <th className="py-4 text-right">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {subsidies.map(s => (
                  <tr key={s.id}>
                    <td className="py-4 font-semibold">{s.region}</td>
                    <td className="py-4 text-blue-400">{s.crop}</td>
                    <td className="py-4">{s.amount}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'Distributed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {s.status === 'Pending Review' ? (
                        <button onClick={() => approveSubsidy(s.id)} className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold px-3 py-1.5 rounded-lg transition-all">
                          Release Funds
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Released</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Performance */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 className="font-bold text-amber-400 border-b border-white/10 pb-2">Top Crop Distributions</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex justify-between"><span>1. Wheat</span> <span className="font-mono text-slate-400">42% (17,850 Tons)</span></li>
                <li className="flex justify-between"><span>2. Corn</span> <span className="font-mono text-slate-400">28% (11,900 Tons)</span></li>
                <li className="flex justify-between"><span>3. Rice</span> <span className="font-mono text-slate-400">20% (8,500 Tons)</span></li>
                <li className="flex justify-between"><span>4. Soybeans</span> <span className="font-mono text-slate-400">10% (4,250 Tons)</span></li>
              </ul>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
              <h4 className="font-bold text-amber-400 border-b border-white/10 pb-2">Regional Production Share</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex justify-between"><span>Region A</span> <span className="font-mono text-slate-400">35%</span></li>
                <li className="flex justify-between"><span>Region B</span> <span className="font-mono text-slate-400">30%</span></li>
                <li className="flex justify-between"><span>Region C</span> <span className="font-mono text-slate-400">20%</span></li>
                <li className="flex justify-between"><span>Region D</span> <span className="font-mono text-slate-400">15%</span></li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
