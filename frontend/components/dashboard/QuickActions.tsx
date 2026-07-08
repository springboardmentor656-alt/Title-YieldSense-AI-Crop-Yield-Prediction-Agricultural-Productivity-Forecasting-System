"use client";

import {
    Plus,
    CloudSun,
    FileText,
    Brain
} from "lucide-react";

const actions = [

    {
        title: "Add Farm",
        icon: <Plus />,
    },

    {
        title: "Weather",
        icon: <CloudSun />,
    },

    {
        title: "Prediction",
        icon: <Brain />,
    },

    {
        title: "Reports",
        icon: <FileText />,
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

                    <button

                        key={action.title}

                        className="border rounded-lg p-5 hover:bg-green-50 transition"

                    >

                        <div className="flex flex-col items-center gap-3">

                            {action.icon}

                            <span>

                                {action.title}

                            </span>

                        </div>

                    </button>

                ))}

            </div>

        </div>

    );

}