import api from "@/lib/axios";

export const getWeather = async (farmId: number) => {

    const response = await api.get(

        `/weather/${farmId}`

    );

    return response.data;

};

export const refreshWeather = async (

    farmId: number

) => {

    const response =

        await api.post(

            `/weather/refresh/${farmId}`

        );

    return response.data;

};