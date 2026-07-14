"use client";
import React, { useState } from 'react';

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Forecast Form State
  const [temp, setTemp] = useState('24.5');
  const [rainfall, setRainfall] = useState('120.0');
  const [ph, setPh] = useState('6.2');
  const [loading, setLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<{
    yieldAmount: number;
    weatherStatus: string;
    soilSuitability: string;
    confidence: number;
  } | null>({
    yieldAmount: 1250.00,
    weatherStatus: 'Optimal',
    soilSuitability: 'High Fertility',
    confidence: 0.92
  });

  // Farms State
  const [farms, setFarms] = useState([
    { id: 1, name: 'North Field', location: 'Region A', size: 12.5, ph: 6.2 },
    { id: 2, name: 'Valley Farm', location: 'Region B', size: 8.2, ph: 5.8 },
  ]);
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('Region A');
  const [size, setSize] = useState('');
  const [farmPh, setFarmPh] = useState('');

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName || !size || !farmPh) return;
    const newFarm = {
      id: farms.length + 1,
      name: farmName,
      location,
      size: parseFloat(size),
      ph: parseFloat(farmPh),
    };
    setFarms([...farms, newFarm]);
    setFarmName('');
    setSize('');
    setFarmPh('');
  };

  const handleForecastYield = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/predict-yield', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avg_temp: parseFloat(temp),
          rainfall: parseFloat(rainfall),
          soil_ph: parseFloat(ph),
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction API failed to respond.');
      }

      const data = await response.json();
      setForecastResult({
        yieldAmount: data.estimated_yield_kg_ha,
        weatherStatus: data.weather_impact_assessment,
        soilSuitability: data.soil_suitability_rating,
        confidence: data.confidence_score,
      });
    } catch (err: any) {
      alert(err.message || 'Error occurred connecting to the API server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-gradient mb-12">YieldSense AI</h2>
        <nav className="flex flex-col gap-4">
          <button onClick={() => setActiveTab('dashboard')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Farmer Dashboard
          </button>
          <button onClick={() => setActiveTab('farm-data')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'farm-data' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Farm Data
          </button>
          <button onClick={() => setActiveTab('weather')} className={`p-3 text-left rounded-xl transition-all ${activeTab === 'weather' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            Weather Logs
          </button>
          <a href="/login" className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto text-left">
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-3xl font-bold">
              {activeTab === 'dashboard' && "Farmer Dashboard"}
              {activeTab === 'farm-data' && "Farm Data Management"}
              {activeTab === 'weather' && "Meteorological Weather Logs"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === 'dashboard' && "Manage crop details, soil metrics, and yield prediction cycles."}
              {activeTab === 'farm-data' && "Onboard acreage structures, coordinates, and soil metrics."}
              {activeTab === 'weather' && "7-Day high-frequency regional climate forecast."}
            </p>
          </div>
          <div className="flex items-center gap-4 glass px-4 py-2 rounded-full">
            <span className="text-slate-300 font-medium">Welcome, John Doe (Farmer)</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500"></div>
          </div>
        </header>

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 relative z-10">
            {/* Dynamic Forecast Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform">
                <h3 className="text-slate-400 text-sm font-medium">Predicted Yield</h3>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {forecastResult ? `${forecastResult.yieldAmount.toLocaleString()} ` : '— '}
                  <span className="text-lg text-slate-500 font-normal">kg/ha</span>
                </p>
              </div>
              <div className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform">
                <h3 className="text-slate-400 text-sm font-medium">Soil Suitability</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {forecastResult ? forecastResult.soilSuitability : '—'}
                </p>
              </div>
              <div className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform">
                <h3 className="text-slate-400 text-sm font-medium">Weather Assessment</h3>
                <p className="text-3xl font-bold text-purple-400 mt-2">
                  {forecastResult ? forecastResult.weatherStatus : '—'}
                </p>
              </div>
            </div>

            {/* Input Form for Real-time AI Yield Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-3xl border border-white/5 lg:col-span-1">
                <h3 className="text-xl font-bold mb-6">Calculate Forecast</h3>
                <form onSubmit={handleForecastYield} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Avg Temperature (°C)</label>
                    <input type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 text-white" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Avg Annual Rainfall (mm)</label>
                    <input type="number" step="0.1" value={rainfall} onChange={(e) => setRainfall(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 text-white" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Soil pH</label>
                    <input type="number" step="0.1" value={ph} onChange={(e) => setPh(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 text-white" required />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-55">
                    {loading ? "Analyzing..." : "Forecast Yield"}
                  </button>
                </form>
              </div>

              {/* Visualization Placeholder */}
              <div className="glass-dark p-8 rounded-3xl border border-white/5 lg:col-span-2 flex flex-col items-center justify-center">
                <svg className="w-16 h-16 text-slate-600 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-slate-400 text-lg font-medium">Model Inference Engine Output</p>
                <p className="text-slate-600 text-sm mt-1 max-w-sm text-center">
                  Predictive calculations are processed using the Random Forest algorithm trained on your preprocessed crop yields datasets.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Farm Data */}
        {activeTab === 'farm-data' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-6">Onboard New Farm</h3>
              <form onSubmit={handleAddFarm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Farm Name</label>
                  <input type="text" value={farmName} onChange={(e) => setFarmName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 text-white" placeholder="e.g. South Pasture" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500">
                      <option value="Region A">Region A</option>
                      <option value="Region B">Region B</option>
                      <option value="Region C">Region C</option>
                      <option value="Region D">Region D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Size (Hectares)</label>
                    <input type="number" step="0.1" value={size} onChange={(e) => setSize(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 text-white" placeholder="e.g. 10.5" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Soil pH</label>
                  <input type="number" step="0.1" value={farmPh} onChange={(e) => setFarmPh(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 text-white" placeholder="e.g. 6.5" required />
                </div>
                <button type="submit" className="w-full py-4 mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                  Register Farm
                </button>
              </form>
            </div>

            <div className="glass-dark p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-6">Registered Acreages</h3>
              <div className="space-y-4 max-h-[350px] overflow-y-auto">
                {farms.map((farm) => (
                  <div key={farm.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-green-400">{farm.name}</h4>
                      <p className="text-slate-400 text-xs mt-1">{farm.location} • {farm.size} Hectares</p>
                    </div>
                    <span className="glass px-3 py-1 rounded-full text-xs font-semibold text-blue-400">
                      pH: {farm.ph}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Weather */}
        {activeTab === 'weather' && (
          <div className="glass p-8 rounded-3xl border border-white/5 relative z-10 overflow-x-auto">
            <h3 className="text-xl font-bold mb-6">7-Day Meteorological Outlook</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="py-4">Day</th>
                  <th className="py-4">Temp (°C)</th>
                  <th className="py-4">Precipitation (mm)</th>
                  <th className="py-4">Wind Speed (km/h)</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-4 font-medium">Monday</td>
                  <td className="py-4">24.5°C</td>
                  <td className="py-4">0.0 mm</td>
                  <td className="py-4">12 km/h</td>
                  <td className="py-4 text-green-400">Sunny</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Tuesday</td>
                  <td className="py-4">23.1°C</td>
                  <td className="py-4">1.5 mm</td>
                  <td className="py-4">14 km/h</td>
                  <td className="py-4 text-blue-400">Light Shower</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Wednesday</td>
                  <td className="py-4">21.8°C</td>
                  <td className="py-4">12.0 mm</td>
                  <td className="py-4">22 km/h</td>
                  <td className="py-4 text-purple-400">Heavy Rainfall</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Thursday</td>
                  <td className="py-4">22.4°C</td>
                  <td className="py-4">3.2 mm</td>
                  <td className="py-4">15 km/h</td>
                  <td className="py-4 text-blue-400">Scattered Rain</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Friday</td>
                  <td className="py-4">25.0°C</td>
                  <td className="py-4">0.0 mm</td>
                  <td className="py-4">9 km/h</td>
                  <td className="py-4 text-green-400">Sunny</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Saturday</td>
                  <td className="py-4">26.1°C</td>
                  <td className="py-4">0.0 mm</td>
                  <td className="py-4">11 km/h</td>
                  <td className="py-4 text-green-400">Clear Sky</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Sunday</td>
                  <td className="py-4">24.8°C</td>
                  <td className="py-4">0.5 mm</td>
                  <td className="py-4">13 km/h</td>
                  <td className="py-4 text-yellow-400">Partly Cloudy</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
