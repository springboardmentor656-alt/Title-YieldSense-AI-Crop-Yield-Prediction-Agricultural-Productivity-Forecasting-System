import React from 'react';

export default function FarmData() {
  return (
    <div className="p-10 text-slate-100 min-h-screen bg-slate-900 font-sans">
      <h1 className="text-3xl font-bold mb-8">Farm Data Entry</h1>
      <div className="glass-dark p-8 rounded-3xl max-w-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <form className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location / Region</label>
              <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500" placeholder="e.g. North Field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
              <input type="date" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Crop Type</label>
            <select className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl focus:outline-none focus:border-green-500">
              <option>Wheat</option>
              <option>Corn</option>
              <option>Rice</option>
              <option>Soybeans</option>
            </select>
          </div>
          <button type="button" className="w-full py-4 mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all">
            Save Data Record
          </button>
        </form>
      </div>
    </div>
  );
}
