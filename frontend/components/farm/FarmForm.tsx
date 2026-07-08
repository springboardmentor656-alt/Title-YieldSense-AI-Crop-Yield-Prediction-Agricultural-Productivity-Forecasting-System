"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    farmSchema,
    FarmSchemaType,
} from "@/validators/farm.validator";

interface Props {
    defaultValues?: Partial<FarmSchemaType>;
    onSubmit: (data: FarmSchemaType) => Promise<void>;
    loading?: boolean;
}

export default function FarmForm({
    defaultValues,
    onSubmit,
    loading = false
}: Props) {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FarmSchemaType>({
        resolver: zodResolver(farmSchema),
        defaultValues
    });

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white rounded-xl shadow p-8"
        >

            <div>

                <label>Farm Name</label>

                <Input
                    {...register("farm_name")}
                />

                <p className="text-red-500 text-sm">

                    {errors.farm_name?.message}

                </p>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

                <div>

                    <label>Latitude</label>

                    <Input
                        type="number"
                        step="0.000001"
                        {...register("latitude", { valueAsNumber: true })}
                    />

                </div>

                <div>

                    <label>Longitude</label>

                    <Input
                        type="number"
                        step="0.000001"
                        {...register("longitude", { valueAsNumber: true })}
                    />

                </div>

            </div>

            <div>

                <label>Area (Acres)</label>

                <Input
                    type="number"
                    {...register("area", { valueAsNumber: true })}
                />

            </div>

            <Button
                className="w-full"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Farm"}
            </Button>

        </form>

    );

}