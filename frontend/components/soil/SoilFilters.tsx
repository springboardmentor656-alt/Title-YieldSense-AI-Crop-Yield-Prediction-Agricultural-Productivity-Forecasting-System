"use client";

interface Props {
    fertility: string;
    onFertilityChange: (value: string) => void;
    health: string;
    onHealthChange: (value: string) => void;
}

export default function SoilFilters({
    fertility,
    onFertilityChange,
    health,
    onHealthChange
}: Props) {

    return (

        <div className="flex gap-3">

            <select
                className="border rounded-lg px-4 py-3 bg-white"
                value={fertility}
                onChange={(e) => onFertilityChange(e.target.value)}
            >
                <option value="">All Fertility</option>
                <option value="high">High Fertility</option>
                <option value="medium">Medium Fertility</option>
                <option value="low">Low Fertility</option>
            </select>

            <select
                className="border rounded-lg px-4 py-3 bg-white"
                value={health}
                onChange={(e) => onHealthChange(e.target.value)}
            >
                <option value="">All Health</option>
                <option value="healthy">Healthy</option>
                <option value="moderate">Moderate</option>
                <option value="poor">Poor</option>
            </select>

        </div>

    )

}
