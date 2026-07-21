"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Download } from "lucide-react";

import { useFarm } from "@/hooks/useFarm";

import { useAccuracyTracking } from "@/hooks/useAnalytics";

import * as AnalyticsService from "@/services/analytics.service";

export default function ReportsPage() {

    const { farms } = useFarm();

    const [farmId, setFarmId] = useState<number | null>(null);

    const [entryId, setEntryId] = useState("");

    const [actualYieldValue, setActualYieldValue] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const [exporting, setExporting] = useState(false);

    const { accuracy, loading, recordActualYield } =
        useAccuracyTracking(farmId);

    useEffect(() => {

        if (!farmId && farms.length > 0) {

            setFarmId((farms[0] as any).id);

        }

    }, [farms, farmId]);

    async function handleSubmitActual(e: React.FormEvent) {

        e.preventDefault();

        if (!entryId || !actualYieldValue) {

            toast.error("Enter both an entry ID and an actual yield");

            return;

        }

        setSubmitting(true);

        try {

            await recordActualYield(
                Number(entryId),
                Number(actualYieldValue)
            );

            setEntryId("");
            setActualYieldValue("");

        }

        catch {

            toast.error("Unable to record actual yield");

        }

        finally {

            setSubmitting(false);

        }

    }

    async function handleExport() {

        if (!farmId) {

            return;

        }

        setExporting(true);

        try {

            await AnalyticsService.exportPredictionsCsv(farmId);

        }

        catch {

            toast.error("Unable to export predictions");

        }

        finally {

            setExporting(false);

        }

    }

    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">
                    Reports
                </h1>

                <div className="flex gap-3">
                    <select
                        value={farmId ?? ""}
                        onChange={(e) => setFarmId(Number(e.target.value))}
                        className="border rounded-lg px-4 py-2 bg-white"
                    >
                        {farms.map((farm: any) => (
                            <option key={farm.id} value={farm.id}>
                                {farm.farm_name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleExport}
                        disabled={!farmId || exporting}
                        className="flex items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50"
                    >
                        <Download size={18} />
                        {exporting ? "Exporting..." : "Export CSV"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">
                    Accuracy Tracking
                </h2>

                {loading && <p>Loading accuracy tracking...</p>}

                {!loading && (
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-gray-500">Sample Size</p>
                            <p className="text-3xl font-bold">
                                {accuracy?.sample_size ?? 0}
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-gray-500">MAPE</p>
                            <p className="text-3xl font-bold">
                                {accuracy?.mape != null
                                    ? `${accuracy.mape.toFixed(2)}%`
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                )}

                {!loading &&
                    (!accuracy?.entries || accuracy.entries.length === 0) && (
                        <p className="text-gray-500">
                            No accuracy entries recorded yet for this farm.
                        </p>
                    )}

                {!loading && accuracy?.entries?.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">ID</th>
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Predicted</th>
                                    <th className="py-2">Actual</th>
                                    <th className="py-2">Error %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accuracy.entries.map((entry: any) => (
                                    <tr key={entry.id} className="border-b">
                                        <td className="py-2">{entry.id}</td>
                                        <td className="py-2">
                                            {new Date(
                                                entry.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="py-2">{entry.prediction}</td>
                                        <td className="py-2">{entry.actual_yield}</td>
                                        <td className="py-2">
                                            {entry.absolute_percentage_error?.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">
                    Record Actual Yield
                </h2>

                <p className="text-gray-500 mb-4">
                    After harvest, enter the real observed yield for a
                    prediction entry so accuracy tracking can be calculated.
                </p>

                <form
                    onSubmit={handleSubmitActual}
                    className="flex flex-col md:flex-row gap-4"
                >
                    <input
                        type="number"
                        placeholder="Entry ID"
                        value={entryId}
                        onChange={(e) => setEntryId(e.target.value)}
                        className="border rounded-lg px-4 py-2 flex-1"
                    />

                    <input
                        type="number"
                        step="any"
                        placeholder="Actual Yield"
                        value={actualYieldValue}
                        onChange={(e) => setActualYieldValue(e.target.value)}
                        className="border rounded-lg px-4 py-2 flex-1"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-green-900 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Submit"}
                    </button>
                </form>
            </div>

        </div>
    );

}
