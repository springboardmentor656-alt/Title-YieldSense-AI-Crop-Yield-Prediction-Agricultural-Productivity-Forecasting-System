import { MapPin, Wheat } from "lucide-react";

import { Farm } from "@/types/dashboard";

interface Props {

    farm: Farm;

}

export default function FarmCard({

    farm,

}: Props) {

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-bold">

                {farm.farm_name}

            </h2>

            <div className="mt-5 space-y-3">

                <div className="flex gap-2">

                    <MapPin size={18} />

                    {farm.latitude},

                    {farm.longitude}

                </div>

                <div className="flex gap-2">

                    <Wheat size={18} />

                    {farm.crop_name ?? "Not Assigned"}

                </div>

                <p>

                    Area

                    <span className="font-semibold">

                        {" "}

                        {farm.area} Acres

                    </span>

                </p>

                <p>

                    Prediction

                    <span className="font-semibold text-green-700">

                        {" "}

                        {farm.prediction ?? "--"}%

                    </span>

                </p>

            </div>

        </div>

    );

}