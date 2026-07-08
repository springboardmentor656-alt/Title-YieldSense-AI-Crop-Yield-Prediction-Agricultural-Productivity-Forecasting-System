"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";

interface Props {
    title: string;
    value: number | string;
    suffix?: string;
    icon: React.ReactNode;
    color: string;
}

export default function StatsCard({
    title,
    value,
    suffix = "",
    icon,
    color,
}: Props) {

    const isNumber = typeof value === "number";

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-6 flex justify-between"
        >
            <div>
                <p className="text-gray-500">
                    {title}
                </p>

                <h2 className="text-3xl font-bold mt-3">
                    {isNumber ? (
                        <>
                            <CountUp
                                end={value}
                                duration={2}
                            />
                            {suffix}
                        </>
                    ) : (
                        value
                    )}
                </h2>
            </div>

            <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}
            >
                {icon}
            </div>
        </motion.div>
    );
}