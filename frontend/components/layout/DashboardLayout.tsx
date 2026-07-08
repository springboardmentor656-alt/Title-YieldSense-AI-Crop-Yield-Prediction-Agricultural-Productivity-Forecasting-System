"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>

            <Sidebar />

            {/* Main Content */}
            <div className="ml-64 min-h-screen">

                <Navbar />

                <main className="p-8 bg-gray-100 min-h-[calc(100vh-64px)] overflow-y-auto">
                    {children}
                </main>

            </div>

        </div>
    );
}