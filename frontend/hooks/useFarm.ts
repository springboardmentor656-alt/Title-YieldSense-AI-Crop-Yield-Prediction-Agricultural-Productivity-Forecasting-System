"use client";

import { useEffect, useState } from "react";

import * as FarmService from "@/services/farm.service";

import { toast } from "sonner";

export function useFarm() {

    const [farms, setFarms] = useState([]);

    const [loading, setLoading] = useState(true);

    async function loadFarms() {

        try {

            const data = await FarmService.getFarms();

            setFarms(data);

        }

        catch {

            toast.error("Unable to load farms");

        }

        finally {

            setLoading(false);

        }

    }

    async function removeFarm(id: number) {

        await FarmService.deleteFarm(id);

        toast.success("Farm deleted");

        loadFarms();

    }

    useEffect(() => {

        loadFarms();

    }, []);

    return {

        farms,

        loading,

        removeFarm,

        refresh: loadFarms

    };

}