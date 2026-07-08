"use client";

import EmptyState from "./EmptyState";

import FarmCard from "./FarmCard";

import SkeletonCard from "./SkeletonCard";

import { useDashboard } from "@/hooks/useDashboard";

export default function FarmOverview() {

    const {

        farms,

        loading,

    } = useDashboard();


    if (loading)

        return (

            <div className="grid md:grid-cols-2 gap-6">

                <SkeletonCard />

                <SkeletonCard />

            </div>

        );

    if (farms.length === 0)

        return <EmptyState />;

    return (

        <div>

            <h2 className="text-3xl font-bold mb-6">

                My Farms

            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {farms.map((farm: any) => (

                    <FarmCard

                        key={farm.id}

                        farm={farm}

                    />

                ))}

            </div>

        </div>

    );

}