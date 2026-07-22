"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "🏠",
      href: "/dashboard",
    },
    {
      name: "Prediction",
      icon: "🌾",
      href: "/prediction",
    },
    {
      name: "Weather",
      icon: "🌦",
      href: "/weather",
    },
    {
      name: "Soil Health",
      icon: "🌱",
      href: "/soil",
    },
    {
      name: "History",
      icon: "📜",
      href: "/history",
    },
    {
      name: "Farm Profile",
      icon: "👨‍🌾",
      href: "/farm-profile",
    },
    {
      name: "Logout",
      icon: "🚪",
      href: "/login",
    },
  ];

  return (
    <aside
      style={{
        width: "250px",
        height: "100vh",
        background: "#1B5E20",
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "25px 20px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "24px",
          }}
        >
          🌾 YieldSense AI
        </h2>

        <p
          style={{
            marginTop: "8px",
            fontSize: "13px",
            color: "#C8E6C9",
          }}
        >
          Smart Agriculture System
        </p>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "20px 15px",
        }}
      >
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  marginBottom: "12px",
                  borderRadius: "10px",
                  background: active ? "#4CAF50" : "transparent",
                  color: "#fff",
                  fontSize: "17px",
                  fontWeight: active ? "bold" : "normal",
                  transition: "0.3s",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "22px" }}>
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#C8E6C9",
          }}
        >
          Version 2.0
        </p>

        <p
          style={{
            marginTop: "5px",
            fontSize: "12px",
            color: "#A5D6A7",
          }}
        >
          © 2026 YieldSense AI
        </p>
      </div>
    </aside>
  );
}