"use client";

import { Button } from "@/components/ui/button";

interface Props {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
}

export default function SoilPagination({
    page,
    pageSize,
    total,
    onPageChange
}: Props) {

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (

        <div className="flex items-center justify-between bg-white rounded-xl shadow px-6 py-4">

            <p className="text-sm text-gray-500">
                Page {page} of {totalPages} ({total} report{total === 1 ? "" : "s"})
            </p>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </Button>
            </div>

        </div>

    )

}
