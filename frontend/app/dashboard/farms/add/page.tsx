"use client";

import { useRouter } from "next/navigation";

import FarmForm from "@/components/farm/FarmForm";

import { createFarm } from "@/services/farm.service";

import { toast } from "sonner";

export default function AddFarmPage() {

    const router = useRouter();

    async function submit(data: any) {

        await createFarm(data);

        toast.success("Farm Added Successfully");

        router.push("/dashboard/farms");

    }

    return (

        <div className="space-y-6">

            <h1 className="text-4xl font-bold">

                Add Farm

            </h1>

            <FarmForm

                onSubmit={submit}

            />

        </div>

    )

}