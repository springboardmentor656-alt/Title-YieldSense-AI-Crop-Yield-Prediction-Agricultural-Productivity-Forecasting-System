import api from "@/lib/axios";

import { User } from "@/types/user";

export const getUsers = async (): Promise<User[]> => {

    const response = await api.get("/users/");

    return response.data;

};

export const updateUserRole = async (
    id: number,
    role: string
): Promise<User> => {

    const response = await api.put(`/users/${id}/role`, { role });

    return response.data;

};

export const updateUserStatus = async (
    id: number,
    is_active: boolean
): Promise<User> => {

    const response = await api.patch(`/users/${id}/status`, { is_active });

    return response.data;

};

export const deleteUser = async (id: number) => {

    const response = await api.delete(`/users/${id}`);

    return response.data;

};
