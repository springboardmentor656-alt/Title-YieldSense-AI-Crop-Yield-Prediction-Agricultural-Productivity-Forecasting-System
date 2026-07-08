"use client";

import {

    MapContainer,

    Marker,

    Popup,

    TileLayer,

} from "react-leaflet";

interface Props {

    farms: any[];

}

export default function FarmMap({

    farms,

}: Props) {

    return (

        <div className="bg-white rounded-xl shadow-md p-4">

            <h2 className="text-2xl font-bold mb-4">

                Farm Locations

            </h2>

            <MapContainer

                center={[20.5937, 78.9629]}

                zoom={5}

                style={{

                    height: "400px",

                    width: "100%",

                }}

            >

                <TileLayer

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                />

                {

                    farms.map((farm) => (

                        <Marker

                            key={farm.id}

                            position={[farm.latitude, farm.longitude]}

                        >

                            <Popup>

                                {farm.farm_name}

                            </Popup>

                        </Marker>

                    ))

                }

            </MapContainer>

        </div>

    )

}