"use client";

import { format } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";

export default function DashboardHeader() {
    const today = format(new Date(), "EEEE, dd MMMM yyyy");

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">

            <div>

                <h1 className="text-4xl font-bold">
                    Good Morning 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Welcome back to YieldSense AI
                </p>

                <div className="flex gap-5 mt-4 text-gray-500">

                    <div className="flex items-center gap-2">

                        <CalendarDays size={18} />

                        {today}

                    </div>

                    <div className="flex items-center gap-2">

                        <MapPin size={18} />

                        Kerala, India

                    </div>

                </div>

            </div>

        </div>
    );
}