"use client";

import { useEffect, useState } from "react";

import * as CropService from "@/services/crop.service";
import { Crop } from "@/types/crop";

import { toast } from "sonner";

export function useCrop(farmId?: number) {
    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        if (!farmId) {
            return;
        }

        setLoading(true);

        try {
            const data = await CropService.getCropsForFarm(farmId);
            setCrops(data);
        } catch {
            toast.error("Unable to load crops");
        } finally {
            setLoading(false);
        }
    }

    async function addCrop(cropName: string, hectaresPlanted?: number) {
        if (!farmId) {
            return;
        }

        await CropService.createCrop({
            farm_id: farmId,
            crop_name: cropName,
            hectares_planted: hectaresPlanted,
        });

        toast.success("Crop added");
        load();
    }

    async function removeCrop(cropId: number) {
        await CropService.deleteCrop(cropId);
        toast.success("Crop removed");
        load();
    }

    useEffect(() => {
        if (farmId) {
            load();
        } else {
            setCrops([]);
            setLoading(false);
        }
    }, [farmId]);

    return {
        crops,
        loading,
        addCrop,
        removeCrop,
        refresh: load,
    };
}
