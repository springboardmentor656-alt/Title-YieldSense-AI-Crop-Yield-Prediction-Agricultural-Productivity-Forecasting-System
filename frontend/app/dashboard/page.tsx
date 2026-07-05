"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

interface Farm {
  id: number;
  farm_name: string;
  location: string;
  area_hectares: number;
  soil_ph: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [farmForm, setFarmForm] = useState({
    farm_name: "",
    location: "",
    area_hectares: "",
    soil_ph: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/"); return; }
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const data = await api.getFarms();
      setFarms(data);
    } catch {
      // token expired
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createFarm({
        farm_name: farmForm.farm_name,
        location: farmForm.location,
        area_hectares: parseFloat(farmForm.area_hectares),
        soil_ph: parseFloat(farmForm.soil_ph),
        latitude: parseFloat(farmForm.latitude),
        longitude: parseFloat(farmForm.longitude),
      });
      setShowFarmForm(false);
      setFarmForm({ farm_name: "", location: "", area_hectares: "", soil_ph: "", latitude: "", longitude: "" });
      loadFarms();
    } catch (err) {
      alert("Failed to create farm");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-green-600 text-xl font-medium">Loading YieldSense...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold">YieldSense AI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-200 text-sm">
            {user?.full_name} ({user?.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-green-600 hover:bg-green-500 px-4 py-1.5 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {user?.full_name}! 👋
          </h2>
          <p className="text-green-100 text-sm">
            AI-powered insights for smarter agricultural decisions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Farms", value: farms.length, icon: "🏡", color: "bg-green-50 border-green-200" },
            { label: "Predictions", value: "0", icon: "📊", color: "bg-blue-50 border-blue-200" },
            { label: "Alerts", value: "0", icon: "🔔", color: "bg-yellow-50 border-yellow-200" },
            { label: "Recommendations", value: "0", icon: "💡", color: "bg-purple-50 border-purple-200" },
          ].map((stat) => (
            <div key={stat.label} className={`border rounded-xl p-4 ${stat.color}`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Module Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Yield Prediction", icon: "🌱", desc: "Forecast crop yield", color: "hover:bg-green-50 hover:border-green-300" },
            { label: "Weather Analysis", icon: "🌤️", desc: "Climate trends", color: "hover:bg-blue-50 hover:border-blue-300" },
            { label: "Soil Analysis", icon: "🪱", desc: "Soil health metrics", color: "hover:bg-yellow-50 hover:border-yellow-300" },
            { label: "Recommendations", icon: "💡", desc: "Farming advice", color: "hover:bg-purple-50 hover:border-purple-300" },
          ].map((mod) => (
            <div
              key={mod.label}
              className={`border bg-white rounded-xl p-4 cursor-pointer transition-all ${mod.color}`}
            >
              <div className="text-3xl mb-2">{mod.icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{mod.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{mod.desc}</div>
            </div>
          ))}
        </div>

        {/* Farms Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">🏡 My Farms</h3>
            <button
              onClick={() => setShowFarmForm(!showFarmForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              + Add Farm
            </button>
          </div>

          {/* Add Farm Form */}
          {showFarmForm && (
            <form onSubmit={handleCreateFarm} className="bg-green-50 rounded-xl p-4 mb-6 grid grid-cols-2 gap-3">
              <input
                placeholder="Farm Name *"
                value={farmForm.farm_name}
                onChange={e => setFarmForm({ ...farmForm, farm_name: e.target.value })}
                required
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Location"
                value={farmForm.location}
                onChange={e => setFarmForm({ ...farmForm, location: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Area (hectares)"
                type="number"
                value={farmForm.area_hectares}
                onChange={e => setFarmForm({ ...farmForm, area_hectares: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Soil pH (0-14)"
                type="number"
                step="0.1"
                value={farmForm.soil_ph}
                onChange={e => setFarmForm({ ...farmForm, soil_ph: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Latitude"
                type="number"
                step="any"
                value={farmForm.latitude}
                onChange={e => setFarmForm({ ...farmForm, latitude: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Longitude"
                type="number"
                step="any"
                value={farmForm.longitude}
                onChange={e => setFarmForm({ ...farmForm, longitude: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                  Save Farm
                </button>
                <button type="button" onClick={() => setShowFarmForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Farms List */}
          {farms.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">🌾</div>
              <p className="font-medium">No farms yet</p>
              <p className="text-sm">Add your first farm to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {farms.map((farm) => (
                <div key={farm.id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-2xl">🏡</div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{farm.farm_name}</h4>
                  <p className="text-sm text-gray-400">{farm.location || "No location"}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>📐 {farm.area_hectares || "—"} ha</div>
                    <div>🧪 pH {farm.soil_ph || "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}