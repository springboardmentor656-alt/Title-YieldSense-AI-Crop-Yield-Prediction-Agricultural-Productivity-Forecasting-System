import { MapPin } from "lucide-react";

export default function FarmInfo({ farm }: any) {

    return (

        <div className="bg-white rounded-xl shadow p-8">

            <h2 className="text-3xl font-bold">

                {farm.farm_name}

            </h2>

            <div className="mt-6 space-y-4">

                <p>

                    Area

                    <strong>

                        {" "}

                        {farm.area}

                        Acres

                    </strong>

                </p>

                <p>

                    <MapPin

                        className="inline mr-2"

                        size={18}

                    />

                    {farm.latitude},

                    {farm.longitude}

                </p>

                <p>

                    Crop

                    <strong>

                        {" "}

                        {farm.crop_name ?? "--"}

                    </strong>

                </p>

                <p>

                    Prediction

                    <strong className="text-green-700">

                        {" "}

                        {farm.prediction ?? "--"}%

                    </strong>

                </p>

            </div>

        </div>

    )

}