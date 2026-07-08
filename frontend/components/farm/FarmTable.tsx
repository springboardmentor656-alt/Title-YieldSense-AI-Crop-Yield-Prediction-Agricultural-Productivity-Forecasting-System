"use client";

import { useState } from "react";

import { Farm } from "@/types/farm";

import FarmActions from "./FarmActions";

import FarmStatusBadge from "./FarmStatusBadge";

import DeleteFarmDialog from "./DeleteFarmDialog";

interface Props {

    farms: Farm[];

    onDelete: (id: number) => void;

}

export default function FarmTable({

    farms,

    onDelete

}: Props) {

    const [selected, setSelected] =

        useState<number | null>(null);

    return (

        <div className="bg-white rounded-xl shadow">

            <table className="w-full">

                <thead>

                    <tr className="border-b">

                        <th className="p-4 text-left">

                            Farm

                        </th>

                        <th>Area</th>

                        <th>Crop</th>

                        <th>Prediction</th>

                        <th>Status</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {farms.map((farm) => (

                        <tr

                            key={farm.id}

                            className="border-b"

                        >

                            <td className="p-4">

                                {farm.farm_name}

                            </td>

                            <td>

                                {farm.area}

                            </td>

                            <td>

                                {farm.crop_name ?? "--"}

                            </td>

                            <td>

                                {farm.prediction ?? "--"}

                            </td>

                            <td>

                                <FarmStatusBadge

                                    prediction={farm.prediction}

                                />

                            </td>

                            <td>

                                <FarmActions

                                    id={farm.id}

                                    onDelete={() => setSelected(farm.id)}

                                />

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            <DeleteFarmDialog

                open={selected !== null}

                onClose={() => setSelected(null)}

                onConfirm={() => {

                    if (selected) {

                        onDelete(selected);

                    }

                    setSelected(null);

                }}

            />

        </div>

    )

}