"use client";

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

    const data = {

        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

        datasets: [{

            label: "Predicted Yield",

            data: [55, 61, 68, 80, 77, 92],

            borderColor: "#16a34a",

            backgroundColor: "#16a34a"

        }]

    };

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="font-bold text-xl mb-5">

                Yield Trend

            </h2>

            <Line data={data} />

        </div>

    )

}