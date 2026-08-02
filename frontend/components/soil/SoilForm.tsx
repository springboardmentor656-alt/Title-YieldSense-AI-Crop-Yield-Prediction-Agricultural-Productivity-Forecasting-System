"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    soilReportSchema,
    SoilReportSchemaType,
} from "@/validators/soil.validator";

interface Props {
    defaultValues?: Partial<SoilReportSchemaType>;
    onSubmit: (data: SoilReportSchemaType) => Promise<void>;
    loading?: boolean;
}

export default function SoilForm({
    defaultValues,
    onSubmit,
    loading = false
}: Props) {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SoilReportSchemaType>({
        resolver: zodResolver(soilReportSchema),
        defaultValues
    });

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white rounded-xl shadow p-8"
        >

            <div>

                <label>Soil pH</label>

                <Input
                    type="number"
                    step="0.1"
                    {...register("ph", { valueAsNumber: true })}
                />

                <p className="text-red-500 text-sm">
                    {errors.ph?.message}
                </p>

            </div>

            <div className="grid md:grid-cols-3 gap-5">

                <div>
                    <label>Nitrogen (kg/ha)</label>
                    <Input
                        type="number"
                        step="any"
                        {...register("nitrogen", { valueAsNumber: true })}
                    />
                    <p className="text-red-500 text-sm">
                        {errors.nitrogen?.message}
                    </p>
                </div>

                <div>
                    <label>Phosphorus (kg/ha)</label>
                    <Input
                        type="number"
                        step="any"
                        {...register("phosphorus", { valueAsNumber: true })}
                    />
                    <p className="text-red-500 text-sm">
                        {errors.phosphorus?.message}
                    </p>
                </div>

                <div>
                    <label>Potassium (kg/ha)</label>
                    <Input
                        type="number"
                        step="any"
                        {...register("potassium", { valueAsNumber: true })}
                    />
                    <p className="text-red-500 text-sm">
                        {errors.potassium?.message}
                    </p>
                </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

                <div>
                    <label>Moisture (%)</label>
                    <Input
                        type="number"
                        step="any"
                        {...register("moisture", { valueAsNumber: true })}
                    />
                    <p className="text-red-500 text-sm">
                        {errors.moisture?.message}
                    </p>
                </div>

                <div>
                    <label>Organic Carbon (%)</label>
                    <Input
                        type="number"
                        step="any"
                        {...register("organic_carbon", { valueAsNumber: true })}
                    />
                    <p className="text-red-500 text-sm">
                        {errors.organic_carbon?.message}
                    </p>
                </div>

            </div>

            <Button
                className="w-full"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Soil Report"}
            </Button>

        </form>

    );

}
