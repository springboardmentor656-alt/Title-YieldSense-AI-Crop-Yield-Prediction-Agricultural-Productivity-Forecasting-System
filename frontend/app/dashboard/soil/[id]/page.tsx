"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import SoilInfo from "@/components/soil/SoilInfo";

import { getSoilReport } from "@/services/soil.service";
import { SoilReport } from "@/types/soil";

export default function SoilReportDetails() {

    const { id } = useParams();

    const [report, setReport] = useState<SoilReport>();

    useEffect(() => {

        async function load() {
            const data = await getSoilReport(Number(id));
            setReport(data);
        }

        load();

    }, [id]);

    if (!report) {
        return <p>Loading...</p>;
    }

    return (

        <div className="space-y-8">

            <h1 className="text-4xl font-bold">
                Soil Report
            </h1>

            <SoilInfo report={report} />

        </div>

    )

}
