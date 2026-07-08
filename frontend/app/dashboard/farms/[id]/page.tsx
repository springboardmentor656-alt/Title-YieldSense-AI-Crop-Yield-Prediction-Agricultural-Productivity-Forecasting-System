"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { getFarm } from "@/services/farm.service";

import FarmInfo from "@/components/farm/FarmInfo";

import FarmMap from "@/components/dashboard/FarmMap";

export default function FarmDetails() {

    const { id } = useParams();

    const [farm, setFarm] = useState<any>();

    useEffect(() => {

        async function load() {

            const data =

                await getFarm(Number(id));

            setFarm(data);

        }

        load();

    }, [id]);

    if (!farm) {

        return <p>Loading...</p>;

    }

    return (

        <div className="space-y-8">

            <FarmInfo farm={farm} />

            <FarmMap farms={[farm]} />

        </div>

    )

}