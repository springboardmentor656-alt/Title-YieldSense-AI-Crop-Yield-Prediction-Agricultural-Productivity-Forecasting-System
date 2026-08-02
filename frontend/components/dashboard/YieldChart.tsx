"use client";

import { useEffect, useState } from "react";

import {

    Chart as ChartJS,

    CategoryScale,

    LinearScale,

    PointElement,

    LineElement,

    Title,

    Tooltip,

    Legend

} from "chart.js";

import { Line } from "react-chartjs-2";

import { useFarm } from "@/hooks/useFarm";
import { useYieldTrend } from "@/hooks/useAnalytics";

ChartJS.register(

    CategoryScale,

    LinearScale,

    PointElement,

    LineElement,

    Title,

    Tooltip,

    Legend

);

export default function YieldChart() {

    const { farms } = useFarm();

    const [farmId, setFarmId] = useState<number | null>(null);

    useEffect(() => {

        if (!farmId && farms.length > 0) {

            setFarmId((farms[0] as any).id);

        }

    }, [farms, farmId]);

    const { trend, loading } = useYieldTrend(farmId);

    const data = {

        labels: trend?.points?.map((p: any) => new Date(p.date).toLocaleDateString()) ?? [],

        datasets: [{

            label: "Predicted Yield",

            data: trend?.points?.map((p: any) => p.predicted_yield) ?? [],

            borderColor: "#16a34a",

            backgroundColor: "#16a34a"

        }]

    };

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="font-bold text-xl mb-5">

                Yield Trend

            </h2>

            {!farmId && <p className="text-gray-500">Add a farm to see yield trend.</p>}

            {farmId && loading && <p className="text-gray-500">Loading yield trend...</p>}

            {farmId && !loading && (!trend?.points || trend.points.length === 0) && (
                <p className="text-gray-500">No predictions recorded yet for this farm.</p>
            )}

            {farmId && !loading && trend?.points?.length > 0 && (
                <Line data={data} />
            )}

        </div>

    )

}
