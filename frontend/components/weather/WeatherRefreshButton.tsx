"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {

    refresh: () => void;

    loading: boolean;

}

export default function WeatherRefreshButton({

    refresh,

    loading

}: Props) {

    return (

        <Button

            onClick={refresh}

            disabled={loading}

        >

            <RefreshCw

                className={

                    loading

                        ?

                        "animate-spin mr-2"

                        :

                        "mr-2"

                }

            />

            Refresh Weather

        </Button>

    )

}