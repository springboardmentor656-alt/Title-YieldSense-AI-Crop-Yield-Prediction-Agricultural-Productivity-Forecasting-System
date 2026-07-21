"use client";

import Link from "next/link";
import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

import {
    LayoutDashboard,
    Tractor,
    CloudSun,
    Settings,
    LogOut,
    Database,
    FileText,
    Users,
    BarChart3,
    Sprout,
    Bell,
    HelpCircle,
    TrendingUp,
    Wheat,
} from "lucide-react";

export default function Sidebar() {

    // Get logged-in user's role
    const role = useAuthStore((state) => state.user?.role);

    const menuConfig = {
        Farmer: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                name: "Farms",
                href: "/dashboard/farms",
                icon: Tractor,
            },
            {
                name: "Crops",
                href: "/dashboard/crops",
                icon: Wheat,
            },
            {
                name: "Weather",
                href: "/dashboard/weather",
                icon: CloudSun,
            },
            {
                name: "Predictions",
                href: "/dashboard/predictions",
                icon: TrendingUp,
            },
            {
                name: "Soil Analysis",
                href: "/dashboard/soil",
                icon: Sprout,
            },
            {
                name: "Notifications",
                href: "/dashboard/notifications",
                icon: Bell,
            },
            {
                name: "Support",
                href: "/dashboard/support",
                icon: HelpCircle,
            },
            {
                name: "Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],

        "Agriculture Department": [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                name: "Reports",
                href: "/dashboard/reports",
                icon: FileText,
            },
            {
                name: "Weather",
                href: "/dashboard/weather",
                icon: CloudSun,
            },
            {
                name: "Analytics",
                href: "/dashboard/analytics",
                icon: BarChart3,
            },
            {
                name: "Notifications",
                href: "/dashboard/notifications",
                icon: Bell,
            },
            {
                name: "Support",
                href: "/dashboard/support",
                icon: HelpCircle,
            },
        ],

        "Agri Consultant": [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                name: "Farms",
                href: "/dashboard/farms",
                icon: Tractor,
            },
            {
                name: "Crops",
                href: "/dashboard/crops",
                icon: Wheat,
            },
            {
                name: "Soil Analysis",
                href: "/dashboard/soil",
                icon: Sprout,
            },
            {
                name: "Predictions",
                href: "/dashboard/predictions",
                icon: TrendingUp,
            },
            {
                name: "Recommendations",
                href: "/dashboard/recommendations",
                icon: FileText,
            },
            {
                name: "Notifications",
                href: "/dashboard/notifications",
                icon: Bell,
            },
            {
                name: "Support",
                href: "/dashboard/support",
                icon: HelpCircle,
            },
        ],

        Researcher: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                name: "Datasets",
                href: "/dashboard/datasets",
                icon: Database,
            },
            {
                name: "Analytics",
                href: "/dashboard/analytics",
                icon: BarChart3,
            },
            {
                name: "Reports",
                href: "/dashboard/reports",
                icon: FileText,
            },
            {
                name: "Notifications",
                href: "/dashboard/notifications",
                icon: Bell,
            },
            {
                name: "Support",
                href: "/dashboard/support",
                icon: HelpCircle,
            },
        ],

        Administrator: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                name: "Users",
                href: "/dashboard/users",
                icon: Users,
            },
            {
                name: "Farms",
                href: "/dashboard/farms",
                icon: Tractor,
            },
            {
                name: "Crops",
                href: "/dashboard/crops",
                icon: Wheat,
            },
            {
                name: "Predictions",
                href: "/dashboard/predictions",
                icon: TrendingUp,
            },
            {
                name: "Soil Analysis",
                href: "/dashboard/soil",
                icon: Sprout,
            },
            {
                name: "Reports",
                href: "/dashboard/reports",
                icon: FileText,
            },
            {
                name: "Analytics",
                href: "/dashboard/analytics",
                icon: BarChart3,
            },
            {
                name: "Notifications",
                href: "/dashboard/notifications",
                icon: Bell,
            },
            {
                name: "Support",
                href: "/dashboard/support",
                icon: HelpCircle,
            },
            {
                name: "Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],
    };

    const menu =
        menuConfig[role as keyof typeof menuConfig] ??
        menuConfig.Farmer;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-green-900 text-white flex flex-col">

            {/* Logo */}
            <div className="text-center py-8 border-b border-green-800">
                <h1 className="text-3xl font-bold">
                    YieldSense
                </h1>

                <p className="text-green-200 text-sm mt-1">
                    AI Agriculture Platform
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-5 py-6 space-y-3">
                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-700 transition"
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-5 border-t border-green-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}