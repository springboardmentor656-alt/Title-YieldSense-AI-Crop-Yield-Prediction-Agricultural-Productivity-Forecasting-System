interface Props {
    category: string;
}

export default function SoilHealthBadge({
    category
}: Props) {

    if (category === "healthy") {

        return (
            <span className="px-3 py-1 rounded bg-green-100 text-green-700 capitalize">
                {category}
            </span>
        );

    }

    if (category === "moderate") {

        return (
            <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 capitalize">
                {category}
            </span>
        );

    }

    return (
        <span className="px-3 py-1 rounded bg-red-100 text-red-700 capitalize">
            {category}
        </span>
    );

}
