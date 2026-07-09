"use client";
import React, { useState } from 'react';

export default function ResearcherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [datasets] = useState([
    { id: 1, name: 'Kaggle Crop Yield Dataset', size: '2.4 MB', records: '1,000 rows', features: 'Temp, Rain, Pesticides, Yield' },
    { id: 2, name: 'Kaggle Crop Recommendation', size: '4.8 MB', records: '2,200 rows', features: 'N, P, K, pH, Humidity, Rain' },
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-gradient mb-12">YieldSense AI</h2>
        <nav className="flex flex-col gap-4">
          <button onClick={() => setActiveTab('dashboard')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Researcher Lab
          </button>
          <button onClick={() => setActiveTab('datasets')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'datasets' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            ML Datasets
          </button>
          <button onClick={() => setActiveTab('metrics')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'metrics' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Model Metrics
          </button>
          <a href="/login" className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto text-left">
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-3xl font-bold">
              {activeTab === 'dashboard' && "Agricultural Research Lab"}
              {activeTab === 'datasets' && "Target Machine Learning Datasets"}
              {activeTab === 'metrics' && "Model Performance Evaluation"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === 'dashboard' && "Analyze model weights, evaluate loss, and preview crop dataset metrics."}
              {activeTab === 'datasets' && "Explore columns, rows, features, and preprocess summaries of active tables."}
              {activeTab === 'metrics' && "Evaluate error scales, cross-validation runs, and training loss plots."}
            </p>
          </div>
          <div className="flex items-center gap-4 glass px-4 py-2 rounded-full">
            <span className="text-slate-300 font-medium">Welcome, Researcher</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-teal-500"></div>
          </div>
        </header>

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">ML Model accuracy (MAE)</h3>
                <p className="text-3xl font-bold text-teal-400 mt-2">0.084 <span className="text-lg text-slate-500 font-normal">MSE</span></p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Loaded Datasets</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">{datasets.length} <span className="text-lg text-slate-500 font-normal">Tables</span></p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-medium">Model Type</h3>
                <p className="text-3xl font-bold text-purple-400 mt-2">XGBoost <span className="text-lg text-slate-500 font-normal">v1.2</span></p>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-3xl h-80 flex flex-col items-center justify-center border border-white/5">
              <p className="text-slate-400 text-lg font-medium">Model Feature Importance Coefficients (Milestone 2)</p>
              <p className="text-slate-600 text-sm mt-1">Cross-validation plots and training matrices will load here.</p>
            </div>
          </div>
        )}

        {/* Tab 2: Datasets */}
        {activeTab === 'datasets' && (
          <div className="space-y-6 relative z-10">
            {datasets.map(ds => (
              <div key={ds.id} className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-blue-400">{ds.name}</h3>
                  <span className="text-xs glass px-3 py-1 rounded-full text-slate-300">File size: {ds.size}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                  <p><span className="text-white">Record Count:</span> {ds.records}</p>
                  <p><span className="text-white">Main Features:</span> {ds.features}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Metrics */}
        {activeTab === 'metrics' && (
          <div className="glass p-8 rounded-3xl border border-white/5 relative z-10 space-y-8">
            <h3 className="text-xl font-bold">Training Evaluation Output</h3>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-4">Algorithm</th>
                  <th className="py-4">R-Square (R²)</th>
                  <th className="py-4">MAE</th>
                  <th className="py-4">RMSE</th>
                  <th className="py-4 text-right">Inference Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-4 font-semibold text-blue-400">XGBoost Regressor</td>
                  <td className="py-4">0.912</td>
                  <td className="py-4">0.084</td>
                  <td className="py-4">0.112</td>
                  <td className="py-4 text-right">4.5 ms</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-blue-400">Random Forest</td>
                  <td className="py-4">0.885</td>
                  <td className="py-4">0.102</td>
                  <td className="py-4">0.135</td>
                  <td className="py-4 text-right">8.2 ms</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-blue-400">Linear Regression</td>
                  <td className="py-4">0.742</td>
                  <td className="py-4">0.198</td>
                  <td className="py-4">0.245</td>
                  <td className="py-4 text-right">1.2 ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
