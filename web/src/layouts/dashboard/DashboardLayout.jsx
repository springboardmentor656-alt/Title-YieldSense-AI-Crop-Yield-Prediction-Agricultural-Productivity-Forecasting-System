import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  BrainCircuit,
  CloudSun,
  Database,
  History,
  Leaf,
  LogOut,
  Menu,
  Sprout,
  Tractor,
  Upload,
  UserRound,
  X,
  CloudRain,
  FlaskConical,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "My Farms",
    path: "/farms",
    icon: Tractor,
    farmerOnly: true,
  },
  {
    label: "Prediction",
    path: "/prediction",
    icon: BrainCircuit,
    farmerOnly: true,
  },
  {
    label: "Crop Recommendation",
    path: "/recommendation",
    icon: Sprout,
    farmerOnly: true,
  },
  {
    label: "Recommendation History",
    path: "/recommendations/history",
    icon: History,
    farmerOnly: true,
  },
  {
      label: "Weather Analysis",
      icon: CloudRain,
      path: "/weather-analysis",
  },
  {
      label: "Soil Analysis",
      icon: FlaskConical,
      path: "/soil-analysis",
  },
  {
    label: "Analytics Dashboard",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Historical Yield",
    path: "/datasets/historical-yield",
    icon: Database,
  },
  {
    label: "Soil Data",
    path: "/datasets/soil",
    icon: Sprout,
  },
  {
    label: "Weather Data",
    path: "/datasets/weather",
    icon: CloudSun,
  },
  {
    label: "Upload Datasets",
    path: "/datasets/upload",
    icon: Upload,
    adminOnly: true,
  },
  {
    label: "All Farms",
    path: "/admin/farms",
    icon: Tractor,
    adminOnly: true,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
];

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const visibleNavigationItems = useMemo(() => {
    return navigationItems.filter((item) => {
      if (item.adminOnly) {
        return user?.role === "admin";
      }

      if (item.farmerOnly) {
        return user?.role === "farmer";
      }

      return true;
    });
  }, [user]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    } catch {
      toast.error("Unable to complete logout");
    } finally {
      setLoggingOut(false);
    }
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-green-950 text-white">
      <div className="flex items-center justify-between border-b border-green-900 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-700 p-2">
            <Leaf size={24} />
          </div>

          <div>
            <h1 className="font-bold">YieldSense AI</h1>
            <p className="text-xs text-green-300">
              Data Management
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {visibleNavigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-green-100 hover:bg-green-900",
                ].join(" ")
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-green-900 px-5 py-4">
          <p className="text-sm font-semibold text-white">
            {user.full_name}
          </p>

          <p className="mt-1 break-all text-xs text-green-300">
            {user.email}
          </p>

          <p className="mt-1 text-xs capitalize text-green-400">
            {user.role}
          </p>
        </div>
      )}

      <div className="border-t border-green-900 p-4">
        <button
          type="button"
          disabled={loggingOut}
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-200 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut size={19} />

          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        {sidebar}
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="relative z-50">
            {sidebar}
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-5 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sprout
              size={18}
              className="text-green-700"
            />

            Yield Prediction & Agricultural Intelligence
          </div>
        </header>

        <main className="px-5 py-7 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;