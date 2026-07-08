interface Props {

    prediction?: number;

}

export default function FarmStatusBadge({

    prediction

}: Props) {

    if (prediction === undefined) {

        return (

            <span className="px-3 py-1 rounded bg-gray-100">

                Pending

            </span>

        );

    }

    if (prediction >= 90) {

        return (

            <span className="px-3 py-1 rounded bg-green-100 text-green-700">

                Excellent

            </span>

        );

    }

    if (prediction >= 75) {

        return (

            <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700">

                Good

            </span>

        );

    }

    return (

        <span className="px-3 py-1 rounded bg-red-100 text-red-700">

            Poor

        </span>

    );

}