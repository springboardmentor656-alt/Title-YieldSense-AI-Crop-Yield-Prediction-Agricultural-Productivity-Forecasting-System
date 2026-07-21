"use client";

import { useEffect } from "react";

import { Farm } from "@/types/farm";

interface Props {
    farms: Farm[];
    value: number | null;
    onChange: (value: number) => void;
}

export default function FarmPicker({
    farms,
    value,
    onChange,
}: Props) {
    useEffect(() => {
        if (!value && farms.length > 0) {
            onChange(farms[0].id);
        }
    }, [farms, value, onChange]);

    if (farms.length === 0) {
        return null;
    }

    return (
        <select
            className="border rounded-lg px-4 py-3 w-full md:w-72 bg-white"
            value={value ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
        >
            <option value="" disabled>
                Select a farm
            </option>

            {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                    {farm.farm_name}
                </option>
            ))}
        </select>
    );
}
