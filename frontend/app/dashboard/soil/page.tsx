"use client";

import { useState } from "react";

import SoilHeader from "@/components/soil/SoilHeader";
import SoilStatistics from "@/components/soil/SoilStatistics";
import SearchSoil from "@/components/soil/SearchSoil";
import SoilFilters from "@/components/soil/SoilFilters";
import SoilTable from "@/components/soil/SoilTable";
import SoilPagination from "@/components/soil/SoilPagination";

import { useSoilReports } from "@/hooks/useSoilReports";

const PAGE_SIZE = 10;

export default function SoilPage() {

    const [search, setSearch] = useState("");
    const [fertility, setFertility] = useState("");
    const [health, setHealth] = useState("");
    const [page, setPage] = useState(1);

    const { reports, total, loading, removeReport } = useSoilReports({
        search: search || undefined,
        fertility: fertility || undefined,
        health: health || undefined,
        page,
        page_size: PAGE_SIZE,
    });

    function updateSearch(value: string) {
        setSearch(value);
        setPage(1);
    }

    function updateFertility(value: string) {
        setFertility(value);
        setPage(1);
    }

    function updateHealth(value: string) {
        setHealth(value);
        setPage(1);
    }

    return (

        <div className="space-y-8">

            <SoilHeader />

            <SoilStatistics />

            <div className="flex flex-col md:flex-row gap-3">
                <SearchSoil value={search} onChange={updateSearch} />
                <SoilFilters
                    fertility={fertility}
                    onFertilityChange={updateFertility}
                    health={health}
                    onHealthChange={updateHealth}
                />
            </div>

            {loading && (
                <p className="text-gray-500">Loading soil reports...</p>
            )}

            {!loading && reports.length === 0 && (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                    No soil reports found. Add one to get started.
                </div>
            )}

            {!loading && reports.length > 0 && (
                <>
                    <SoilTable reports={reports} onDelete={removeReport} />

                    <SoilPagination
                        page={page}
                        pageSize={PAGE_SIZE}
                        total={total}
                        onPageChange={setPage}
                    />
                </>
            )}

        </div>

    )

}
