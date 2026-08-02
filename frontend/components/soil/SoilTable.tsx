"use client";

import { useState } from "react";

import { SoilReport } from "@/types/soil";

import SoilActions from "./SoilActions";
import SoilHealthBadge from "./SoilHealthBadge";
import DeleteSoilDialog from "./DeleteSoilDialog";

interface Props {
    reports: SoilReport[];
    onDelete: (id: number) => void;
}

export default function SoilTable({
    reports,
    onDelete
}: Props) {

    const [selected, setSelected] =
        useState<number | null>(null);

    return (

        <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="w-full">

                <thead>
                    <tr className="border-b">
                        <th className="p-4 text-left">Farm</th>
                        <th>pH</th>
                        <th>N</th>
                        <th>P</th>
                        <th>K</th>
                        <th>Moisture</th>
                        <th>Organic Carbon</th>
                        <th>Fertility</th>
                        <th>Health</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {reports.map((report) => (
                        <tr
                            key={report.id}
                            className="border-b"
                        >
                            <td className="p-4">
                                {report.farm_name ?? "--"}
                            </td>
                            <td className="text-center">{report.ph}</td>
                            <td className="text-center">{report.nitrogen ?? "--"}</td>
                            <td className="text-center">{report.phosphorus ?? "--"}</td>
                            <td className="text-center">{report.potassium ?? "--"}</td>
                            <td className="text-center">{report.moisture ?? "--"}</td>
                            <td className="text-center">{report.organic_carbon ?? "--"}</td>
                            <td className="text-center capitalize">
                                {report.fertility_category}
                            </td>
                            <td className="text-center">
                                <SoilHealthBadge category={report.health_category} />
                            </td>
                            <td className="text-center">
                                {new Date(report.created_at).toLocaleDateString()}
                            </td>
                            <td>
                                <SoilActions
                                    id={report.id}
                                    onDelete={() => setSelected(report.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <DeleteSoilDialog
                open={selected !== null}
                onClose={() => setSelected(null)}
                onConfirm={() => {
                    if (selected) {
                        onDelete(selected);
                    }
                    setSelected(null);
                }}
            />

        </div>

    )

}
