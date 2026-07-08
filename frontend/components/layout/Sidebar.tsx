"use client";

import Link from "next/link";
import { logout } from "@/services/auth.service";

import {
    LayoutDashboard,
    Tractor,
    CloudSun,
    Settings,
    LogOut,
} from "lucide-react";

export default function Sidebar() {

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

                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-700 transition"
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link
                    href="/dashboard/farms"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-700 transition"
                >
                    <Tractor size={20} />
                    Farms
                </Link>

                <Link
                    href="/dashboard/weather"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-700 transition"
                >
                    <CloudSun size={20} />
                    Weather
                </Link>

                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-700 transition"
                >
                    <Settings size={20} />
                    Settings
                </Link>

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