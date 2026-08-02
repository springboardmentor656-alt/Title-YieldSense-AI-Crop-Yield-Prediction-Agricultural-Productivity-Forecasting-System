import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

export default function SoilHeader() {

    return (

        <div className="flex justify-between items-center">

            <div>
                <h1 className="text-4xl font-bold">
                    Soil Analysis
                </h1>
                <p className="text-gray-500">
                    Track soil health across your farms
                </p>
            </div>

            <Button asChild>
                <Link href="/dashboard/soil/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Soil Report
                </Link>
            </Button>

        </div>

    )

}
