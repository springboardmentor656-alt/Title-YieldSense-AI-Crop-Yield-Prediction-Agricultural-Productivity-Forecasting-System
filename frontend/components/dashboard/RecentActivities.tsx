"use client";

const activities = [

    "Prediction generated successfully",

    "Weather updated",

    "New farm added",

    "Soil report uploaded",

];

export default function RecentActivities() {

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-5">

                Recent Activities

            </h2>

            <div className="space-y-4">

                {activities.map((item) => (

                    <div

                        key={item}

                        className="border-l-4 border-green-600 pl-4"

                    >

                        {item}

                    </div>

                ))}

            </div>

        </div>

    );

}