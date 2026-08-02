"use client";

import Link from "next/link";

import {
    Plus,
    CloudSun,
    Brain,
    FileText,
    FlaskConical,
    Bell,
    BarChart3
} from "lucide-react";

const actions = [

    {
        title: "Add Farm",
        icon: <Plus />,
        href: "/dashboard/farms/add",
    },

    {
        title: "Weather",
        icon: <CloudSun />,
        href: "/dashboard/weather",
    },

    {
        title: "Predict Yield",
        icon: <Brain />,
        href: "/dashboard/predictions",
    },

    {
        title: "Add Soil Report",
        icon: <FlaskConical />,
        href: "/dashboard/soil/add",
    },

    {
        title: "Notifications",
        icon: <Bell />,
        href: "/dashboard/notifications",
    },

    {
        title: "Reports",
        icon: <FileText />,
        href: "/dashboard/reports",
    },

    {
        title: "Analytics",
        icon: <BarChart3 />,
        href: "/dashboard/analytics",
    },

];

export default function QuickActions() {

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-6">

                Quick Actions

            </h2>

            <div className="grid grid-cols-2 gap-4">

                {actions.map((action) => (

                    <Link

                        key={action.title}

                        href={action.href}

                        className="border rounded-lg p-5 hover:bg-green-50 transition"

                    >

                        <div className="flex flex-col items-center gap-3">

                            {action.icon}

                            <span>

                                {action.title}

                            </span>

                        </div>

                    </Link>

                ))}

            </div>

        </div>

    );

}