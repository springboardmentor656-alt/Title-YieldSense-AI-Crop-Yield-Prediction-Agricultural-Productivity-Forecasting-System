"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import FarmPicker from "@/components/farm/FarmPicker";
import SoilForm from "@/components/soil/SoilForm";

import { useFarm } from "@/hooks/useFarm";
import { createSoilReport } from "@/services/soil.service";
import { SoilReportSchemaType } from "@/validators/soil.validator";

import { toast } from "sonner";

export default function AddSoilReportPage() {

    const router = useRouter();

    const { farms, loading: farmsLoading } = useFarm();
    const [farmId, setFarmId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    async function submit(data: SoilReportSchemaType) {

        if (!farmId) {
            toast.error("Select a farm first");
            return;
        }

        setSaving(true);

        try {
            await createSoilReport({ farm_id: farmId, ...data });
            toast.success("Soil Report Added Successfully");
            router.push("/dashboard/soil");
        } catch {
            toast.error("Unable to add soil report");
        } finally {
            setSaving(false);
        }

    }

    return (

        <div className="space-y-6">

            <h1 className="text-4xl font-bold">
                Add Soil Report
            </h1>

            <div className="bg-white rounded-xl shadow p-6">
                {farmsLoading ? (
                    <p className="text-gray-500">Loading farms...</p>
                ) : farms.length === 0 ? (
                    <p className="text-gray-500">
                        Add a farm first to record a soil report.
                    </p>
                ) : (
                    <FarmPicker
                        farms={farms}
                        value={farmId}
                        onChange={setFarmId}
                    />
                )}
            </div>

            {farmId && (
                <SoilForm
                    onSubmit={submit}
                    loading={saving}
                />
            )}

        </div>

    )

}
