"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import SoilForm from "@/components/soil/SoilForm";

import { getSoilReport, updateSoilReport } from "@/services/soil.service";
import { SoilReport } from "@/types/soil";
import { SoilReportSchemaType } from "@/validators/soil.validator";

import { toast } from "sonner";

export default function EditSoilReport() {

    const { id } = useParams();
    const router = useRouter();

    const [report, setReport] = useState<SoilReport>();
    const [saving, setSaving] = useState(false);

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

    async function submit(data: SoilReportSchemaType) {

        setSaving(true);

        try {
            await updateSoilReport(Number(id), data);
            toast.success("Soil Report Updated");
            router.push("/dashboard/soil");
        } catch {
            toast.error("Unable to update soil report");
        } finally {
            setSaving(false);
        }

    }

    return (

        <div className="space-y-6">

            <h1 className="text-4xl font-bold">
                Edit Soil Report — {report.farm_name}
            </h1>

            <SoilForm
                defaultValues={{
                    ph: report.ph,
                    nitrogen: report.nitrogen ?? 0,
                    phosphorus: report.phosphorus ?? 0,
                    potassium: report.potassium ?? 0,
                    moisture: report.moisture ?? 0,
                    organic_carbon: report.organic_carbon ?? 0,
                }}
                onSubmit={submit}
                loading={saving}
            />

        </div>

    )

}
