"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import FarmForm from "@/components/farm/FarmForm";

import {

    getFarm,

    updateFarm

} from "@/services/farm.service";

import { toast } from "sonner";

export default function EditFarm() {

    const { id } = useParams();

    const router = useRouter();

    const [farm, setFarm] = useState<any>();

    useEffect(() => {

        async function load() {

            const data = await getFarm(Number(id));

            setFarm(data);

        }

        load();

    }, [id]);

    if (!farm) {

        return <p>Loading...</p>;

    }

    async function submit(data: any) {

        await updateFarm(Number(id), data);

        toast.success("Farm Updated");

        router.push("/dashboard/farms");

    }

    return (

        <div className="space-y-6">

            <h1 className="text-4xl font-bold">

                Edit Farm

            </h1>

            <FarmForm

                defaultValues={farm}

                onSubmit={submit}

            />

        </div>

    )

}