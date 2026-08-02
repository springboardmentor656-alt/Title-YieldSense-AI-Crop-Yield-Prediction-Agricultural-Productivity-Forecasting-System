import { Droplets, FlaskConical, Gauge, Leaf } from "lucide-react";

import { SoilReport } from "@/types/soil";

import SoilHealthBadge from "./SoilHealthBadge";

export default function SoilInfo({ report }: { report: SoilReport }) {

    return (

        <div className="space-y-6">

            <div className="bg-white rounded-xl shadow p-8">

                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold">
                            {report.farm_name ?? "Farm"}
                        </h2>
                        <p className="text-gray-500">
                            Reported on{" "}
                            {new Date(report.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <SoilHealthBadge category={report.health_category} />
                </div>

            </div>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FlaskConical className="text-green-700" />
                        <h2 className="text-xl font-bold">Soil pH</h2>
                    </div>
                    <p className="text-3xl font-bold">{report.ph}</p>
                    <p className="text-gray-500 capitalize">
                        {report.ph_category}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Gauge className="text-green-700" />
                        <h2 className="text-xl font-bold">Fertility</h2>
                    </div>
                    <p className="text-3xl font-bold">
                        {report.nutrient_score}
                    </p>
                    <p className="text-gray-500 capitalize">
                        {report.fertility_category}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Leaf className="text-green-700" />
                        <h2 className="text-xl font-bold">
                            Soil Health Index
                        </h2>
                    </div>
                    <p className="text-3xl font-bold">
                        {report.soil_health_index}
                    </p>
                    <p className="text-gray-500 capitalize">
                        {report.health_category}
                    </p>
                </div>

            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Droplets className="text-blue-600" />
                    <h2 className="text-xl font-bold">
                        Raw Readings
                    </h2>
                </div>

                <div className="grid md:grid-cols-5 gap-5">
                    <div>
                        <p className="text-sm text-gray-500">Nitrogen (N)</p>
                        <p className="text-2xl font-bold">
                            {report.nitrogen ?? "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Phosphorus (P)</p>
                        <p className="text-2xl font-bold">
                            {report.phosphorus ?? "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Potassium (K)</p>
                        <p className="text-2xl font-bold">
                            {report.potassium ?? "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Moisture</p>
                        <p className="text-2xl font-bold">
                            {report.moisture ?? "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Organic Carbon</p>
                        <p className="text-2xl font-bold">
                            {report.organic_carbon ?? "N/A"}
                        </p>
                    </div>
                </div>
            </div>

        </div>

    )

}
