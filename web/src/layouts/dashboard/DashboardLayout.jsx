import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CloudSun,
  Database,
  Leaf,
  LogOut,
  Menu,
  Sprout,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import authApi from "../../api/authApi";
import { removeToken } from "../../utils/token";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
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
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
];

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.post("/logout");
    } finally {
      removeToken();
      toast.success("Logged out successfully");
      navigate("/login");
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
            <p className="text-xs text-green-300">Data Management</p>
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
        {navigationItems.map((item) => {
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

      <div className="border-t border-green-900 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-200 hover:bg-red-950"
        >
          <LogOut size={19} />
          Logout
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
          <div className="relative z-50">{sidebar}</div>

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
            <Sprout size={18} className="text-green-700" />
            Weeks 1–2: Data Collection
          </div>
        </header>

        <main className="px-5 py-7 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;