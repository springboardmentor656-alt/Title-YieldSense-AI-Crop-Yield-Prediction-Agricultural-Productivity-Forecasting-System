"use client";

import { useMemo, useState } from "react";

import FarmHeader from "@/components/farm/FarmHeader";
import FarmStatistics from "@/components/farm/FarmStatistics";
import SearchFarm from "@/components/farm/SearchFarm";
import FarmTable from "@/components/farm/FarmTable";

import { useFarm } from "@/hooks/useFarm";

export default function FarmsPage() {

    const {

        farms,

        removeFarm,

    } = useFarm();

    const [search, setSearch] =

        useState("");

    const filteredFarms = useMemo(

        () => farms.filter((farm: any) =>

            farm.farm_name

                .toLowerCase()

                .includes(search.toLowerCase())

        ),

        [farms, search]

    );

    return (

        <div className="space-y-8">

            <FarmHeader />

            <SearchFarm

                value={search}

                onChange={setSearch}

            />

            <FarmStatistics

                farms={filteredFarms}

            />

            <FarmTable

                farms={filteredFarms}

                onDelete={removeFarm}

            />

        </div>

    )

}