"use client";
import React, { useState } from 'react';

export default function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adviceQueue, setAdviceQueue] = useState([
    { id: 1, farm: 'North Field', crop: 'Wheat', status: 'Pending Review', soilNPK: 'N: 42, P: 30, K: 35' },
    { id: 2, farm: 'Valley Acreage', crop: 'Rice', status: 'Pending Review', soilNPK: 'N: 55, P: 40, K: 48' },
  ]);
  const [selectedFarm, setSelectedFarm] = useState('North Field');
  const [adviceText, setAdviceText] = useState('');

  const handlePostAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adviceText) return;
    
    // In real app, post to DB. Here we update mock state:
    setAdviceQueue(adviceQueue.map(item => 
      item.farm === selectedFarm ? { ...item, status: 'Resolved' } : item
    ));
    setAdviceText('');
    alert(`Recommendation submitted for ${selectedFarm}!`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-gradient mb-12">YieldSense AI</h2>
        <nav className="flex flex-col gap-4">
          <button onClick={() => setActiveTab('dashboard')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Consultant Desk
          </button>
          <button onClick={() => setActiveTab('clients')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'clients' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Client Farms
          </button>
          <button onClick={() => setActiveTab('queue')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'queue' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Advisory Queue
          </button>
          <a href="/login" className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto text-left">
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-3xl font-bold">
              {activeTab === 'dashboard' && "Consultant Desk"}
              {activeTab === 'clients' && "Client Farms Registry"}
              {activeTab === 'queue' && "Soil & Crop Advisory Queue"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === 'dashboard' && "Review regional farms yield predictions and post custom recommendations."}
              {activeTab === 'clients' && "Analyze N-P-K profiles and soil metrics for managed client acreages."}
              {activeTab === 'queue' && "Submit customized fertilizer regimes and soil optimization strategies."}
            </p>
          </div>
          <div className="flex items-center gap-4 glass px-4 py-2 rounded-full">
            <span className="text-slate-300 font-medium">Welcome, Consultant</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500"></div>
          </div>
        </header>

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Managed Clients</h3>
                <p className="text-3xl font-bold text-purple-400 mt-2">{adviceQueue.length} <span className="text-lg text-slate-500 font-normal">Farms</span></p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Pending Advisory Tasks</h3>
                <p className="text-3xl font-bold text-amber-400 mt-2">{adviceQueue.filter(x => x.status === 'Pending Review').length} <span className="text-lg text-slate-500 font-normal">Requests</span></p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Consulting Score</h3>
                <p className="text-3xl font-bold text-green-400 mt-2">98<span className="text-lg text-slate-500 font-normal">%</span></p>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-3xl h-80 flex flex-col items-center justify-center border border-white/5">
              <p className="text-slate-400 text-lg font-medium">Client Yield Comparison Chart (Milestone 2)</p>
              <p className="text-slate-600 text-sm mt-1">Cross-farm comparative charts and yield analytics dashboards will display here.</p>
            </div>
          </div>
        )}

        {/* Tab 2: Client Farms */}
        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {adviceQueue.map(client => (
              <div key={client.id} className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-purple-400">{client.farm}</h3>
                    <p className="text-slate-400 text-xs">Target Crop: {client.crop}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.status === 'Resolved' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {client.status}
                  </span>
                </div>
                <div className="p-4 bg-black/20 rounded-xl font-mono text-sm space-y-2">
                  <p className="text-slate-400">Soil Nutrients Profile (NPK):</p>
                  <p className="text-white font-bold">{client.soilNPK}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Advisory Queue */}
        {activeTab === 'queue' && (
          <div className="glass p-8 rounded-3xl border border-white/5 relative z-10 max-w-2xl">
            <h3 className="text-xl font-bold mb-6">Write Advisory Recommendation</h3>
            <form onSubmit={handlePostAdvice} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Farm Profile</label>
                <select value={selectedFarm} onChange={(e) => setSelectedFarm(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500">
                  {adviceQueue.map(item => (
                    <option key={item.id} value={item.farm}>{item.farm} (Crop: {item.crop})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Advisory Guidance & Soil Treatment</label>
                <textarea rows={4} value={adviceText} onChange={(e) => setAdviceText(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-slate-500" placeholder="Specify fertilizer adjustments, nitrogen boost, or watering cycles..." required></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                Publish Advisory Prescription
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
