"use client";

import Link from "next/link";

import { Pencil, Trash2, Eye } from "lucide-react";

interface Props {

    id: number;

    onDelete: () => void;

}

export default function FarmActions({

    id,

    onDelete

}: Props) {

    return (

        <div className="flex gap-2">

            <Link

                href={`/dashboard/farms/${id}`}

                className="p-2 rounded hover:bg-gray-100"

            >

                <Eye size={18} />

            </Link>

            <Link

                href={`/dashboard/farms/${id}/edit`}

                className="p-2 rounded hover:bg-gray-100"

            >

                <Pencil size={18} />

            </Link>

            <button

                onClick={onDelete}

                className="p-2 rounded hover:bg-red-100"

            >

                <Trash2

                    size={18}

                    className="text-red-600"

                />

            </button>

        </div>

    )

}