"use client";

import { useEffect, useState } from "react";

import { useFarm } from "@/hooks/useFarm";
import { useRecommendations } from "@/hooks/useRecommendations";

export default function RecommendationPanel() {

    const { farms } = useFarm();

    const [farmId, setFarmId] = useState<number | null>(null);

    useEffect(() => {

        if (!farmId && farms.length > 0) {

            setFarmId((farms[0] as any).id);

        }

    }, [farms, farmId]);

    const { recommendations, loading, notFound } = useRecommendations(farmId ?? undefined);

    return (

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">

            <h2 className="font-bold text-xl mb-3">

                AI Recommendation

            </h2>

            {!farmId && <p>Add a farm to see recommendations.</p>}

            {farmId && loading && <p>Loading recommendation...</p>}

            {farmId && !loading && notFound && (
                <p>No soil report on file yet for this farm.</p>
            )}

            {recommendations && (
                <p>
                    {recommendations.irrigation_plan} {recommendations.fertilizer_advice}
                </p>
            )}

        </div>

    )

}
