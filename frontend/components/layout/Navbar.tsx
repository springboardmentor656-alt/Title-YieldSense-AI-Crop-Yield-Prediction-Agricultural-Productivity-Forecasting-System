"use client";

import { Bell } from "lucide-react";

export default function Navbar() {
    return (
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-8">

            <h2 className="font-bold text-2xl">
                YieldSense AI
            </h2>

            <div className="flex gap-5 items-center">

                <Bell size={22} />

                <img
                    src="https://ui-avatars.com/api/?name=Farmer"
                    className="w-10 h-10 rounded-full"
                />

            </div>

        </header>
    );
}