import api from "@/lib/axios";
import Cookies from "js-cookie";

export const login = async (data: any) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const register = async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};


export const logout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
};