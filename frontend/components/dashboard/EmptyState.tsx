import { Tractor } from "lucide-react";

export default function EmptyState() {

    return (

        <div className="bg-white rounded-xl shadow p-10 text-center">

            <Tractor

                size={60}

                className="mx-auto text-gray-400"

            />

            <h2 className="text-2xl font-bold mt-5">

                No Farms Found

            </h2>

            <p className="text-gray-500 mt-3">

                Add your first farm to start predictions.

            </p>

        </div>

    );

}