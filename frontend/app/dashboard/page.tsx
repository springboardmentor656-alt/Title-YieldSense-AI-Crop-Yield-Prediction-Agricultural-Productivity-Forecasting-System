"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Sprout,
  Home,
  BarChart3,
  Bell,
  Lightbulb,
  CloudSun,
  Waves,
  Plus,
  MapPin,
  Ruler,
  FlaskConical,
} from "lucide-react";

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
    if (!token) {
      router.push("/");
      return;
    }
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const data = await api.getFarms();
      setFarms(data);
    } catch {
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
      setFarmForm({
        farm_name: "",
        location: "",
        area_hectares: "",
        soil_ph: "",
        latitude: "",
        longitude: "",
      });
      loadFarms();
    } catch (err) {
      alert("Failed to create farm");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-[var(--color-primary)] text-sm font-medium">
          Loading YieldSense…
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total farms", value: farms.length, icon: Home, accent: "primary" as const },
    { label: "Predictions", value: 0, icon: BarChart3, accent: "sky" as const },
    { label: "Alerts", value: 0, icon: Bell, accent: "gold" as const },
    { label: "Recommendations", value: 0, icon: Lightbulb, accent: "soil" as const },
  ];

  const moduleCards = [
    { label: "Yield prediction", desc: "Forecast crop yield", icon: Sprout, accent: "primary" as const },
    { label: "Weather analysis", desc: "Climate trends", icon: CloudSun, accent: "sky" as const },
    { label: "Soil analysis", desc: "Soil health metrics", icon: Waves, accent: "soil" as const },
    { label: "Recommendations", desc: "Farming advice", icon: Lightbulb, accent: "gold" as const },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Navbar */}
      <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
            <Sprout size={18} className="text-white" />
          </div>
          <span className="font-display text-lg font-semibold text-[var(--color-primary)]">
            YieldSense AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--color-ink-soft)]">
            {user?.full_name}{" "}
            <span className="uppercase text-xs tracking-wide">
              ({user?.role})
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium border border-[var(--color-border)] rounded-lg px-4 py-2 hover:bg-[var(--color-bg)] transition-colors"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold">
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-[var(--color-ink-soft)] text-sm mt-1">
            AI-powered insights for smarter agricultural decisions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const colorVar = `var(--color-${stat.accent})`;
            return (
              <div
                key={stat.label}
                className="bg-[var(--color-surface)] rounded-lg p-5"
                style={{ borderLeft: `3px solid ${colorVar}` }}
              >
                <Icon size={18} style={{ color: colorVar }} className="mb-3" />
                <div className="font-mono-num text-2xl font-semibold">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--color-ink-soft)] mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Module Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            const colorVar = `var(--color-${mod.accent})`;
            return (
              <button
                key={mod.label}
                className="text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-primary)]/40 hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${colorVar}1A` }}
                >
                  <Icon size={18} style={{ color: colorVar }} />
                </div>
                <div className="font-medium text-sm">{mod.label}</div>
                <div className="text-xs text-[var(--color-ink-soft)] mt-0.5">
                  {mod.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Farms Section */}
        <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-lg font-semibold">My farms</h3>
            <button
              onClick={() => setShowFarmForm(!showFarmForm)}
              className="flex items-center gap-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={15} />
              Add farm
            </button>
          </div>

          {/* Add Farm Form */}
          {showFarmForm && (
            <form
              onSubmit={handleCreateFarm}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 mb-6 grid grid-cols-2 gap-3"
            >
              <input
                placeholder="Farm name *"
                value={farmForm.farm_name}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, farm_name: e.target.value })
                }
                required
                className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
              />
              <input
                placeholder="Location"
                value={farmForm.location}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, location: e.target.value })
                }
                className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
              />
              <input
                placeholder="Area (hectares)"
                type="number"
                value={farmForm.area_hectares}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, area_hectares: e.target.value })
                }
                className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
              />
              <input
                placeholder="Soil pH (0-14)"
                type="number"
                step="0.1"
                value={farmForm.soil_ph}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, soil_ph: e.target.value })
                }
                className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
              />
              <input
                placeholder="Latitude"
                type="number"
                step="any"
                value={farmForm.latitude}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, latitude: e.target.value })
                }
                className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
              />
              <input
                placeholder="Longitude"
                type="number"
                step="any"
                value={farmForm.longitude}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, longitude: e.target.value })
                }
                className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
              />
              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Save farm
                </button>
                <button
                  type="button"
                  onClick={() => setShowFarmForm(false)}
                  className="border border-[var(--color-border)] text-[var(--color-ink-soft)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-bg)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Farms List */}
          {farms.length === 0 ? (
            <div className="text-center py-12">
              <Sprout
                size={36}
                className="mx-auto mb-3 text-[var(--color-ink-soft)]"
              />
              <p className="font-medium">No farms yet</p>
              <p className="text-sm text-[var(--color-ink-soft)]">
                Add your first farm to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-primary)]/40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <Home size={18} className="text-[var(--color-primary)]" />
                    <span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <h4 className="font-medium">{farm.farm_name}</h4>
                  <p className="text-sm text-[var(--color-ink-soft)] flex items-center gap-1 mt-0.5">
                    <MapPin size={13} />
                    {farm.location || "No location"}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--color-ink-soft)] font-mono-num">
                    <div className="flex items-center gap-1">
                      <Ruler size={13} />
                      {farm.area_hectares ?? "—"} ha
                    </div>
                    <div className="flex items-center gap-1">
                      <FlaskConical size={13} />
                      pH {farm.soil_ph ?? "—"}
                    </div>
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