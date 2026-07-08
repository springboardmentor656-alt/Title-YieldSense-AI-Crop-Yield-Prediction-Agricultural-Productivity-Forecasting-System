import { Farm } from "@/types/farm";

interface Props {

    farms: Farm[];

}

export default function FarmStatistics({

    farms

}: Props) {

    const totalArea =

        farms.reduce(

            (sum, f) => sum + f.area,

            0

        );

    return (

        <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white rounded-xl shadow p-6">

                <h3>Total Farms</h3>

                <p className="text-3xl font-bold">

                    {farms.length}

                </p>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

                <h3>Total Area</h3>

                <p className="text-3xl font-bold">

                    {totalArea} Acres

                </p>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

                <h3>Average Area</h3>

                <p className="text-3xl font-bold">

                    {

                        farms.length

                            ?

                            (totalArea / farms.length).toFixed(1)

                            : 0

                    }

                </p>

            </div>

        </div>

    )

}