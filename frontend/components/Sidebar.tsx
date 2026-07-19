"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./sidebar.css";

export default function Sidebar() {

  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Farm Profile", icon: "🚜", path: "/farm-profile" },
    { name: "Soil Analysis", icon: "🌱", path: "/dashboard/soil" },
    { name: "Weather", icon: "☁️", path: "/dashboard/weather" },
    { name: "AI Prediction", icon: "🤖", path: "/dashboard/predict" },
    { name: "Analytics", icon: "📊", path: "/dashboard/analytics" },
    { name: "Recommendation", icon: "💡", path: "/dashboard/recommendation" },
  ];

  return (
    <aside className="sidebar">

      <h2 className="logo">🌾 YieldSense AI</h2>

      <div className="menu">

        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={pathname === item.path ? "menuItem active" : "menuItem"}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}

      </div>

      <Link href="/login" className="logout">
        🚪 Logout
      </Link>

    </aside>
  );
}