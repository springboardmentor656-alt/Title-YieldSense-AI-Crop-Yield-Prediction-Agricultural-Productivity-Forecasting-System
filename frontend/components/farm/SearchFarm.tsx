"use client";

interface Props {

    value: string;

    onChange: (value: string) => void;

}

export default function SearchFarm({

    value,

    onChange

}: Props) {

    return (

        <input

            className="border rounded-lg px-4 py-3 w-full"

            placeholder="Search Farm..."

            value={value}

            onChange={(e) => onChange(e.target.value)}

        />

    )

}