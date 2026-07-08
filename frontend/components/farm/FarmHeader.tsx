import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

export default function FarmHeader() {

    return (

        <div className="flex justify-between items-center">

            <div>

                <h1 className="text-4xl font-bold">

                    My Farms

                </h1>

                <p className="text-gray-500">

                    Manage your agricultural lands

                </p>

            </div>

            <Button asChild>

                <Link href="/dashboard/farms/add">

                    <Plus className="mr-2 h-4 w-4" />

                    Add Farm

                </Link>

            </Button>

        </div>

    )

}