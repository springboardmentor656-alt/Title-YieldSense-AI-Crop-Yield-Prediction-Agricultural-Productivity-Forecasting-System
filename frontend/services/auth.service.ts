import api from "@/lib/axios";
import Cookies from "js-cookie";

import { User } from "@/types/user";

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

export const getMe = async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const updateProfile = async (data: {
    full_name?: string;
    email?: string;
}): Promise<User> => {
    const response = await api.put("/auth/me", data);
    return response.data;
};

export const changePassword = async (data: {
    current_password: string;
    new_password: string;
}) => {
    const response = await api.post("/auth/change-password", data);
    return response.data;
};