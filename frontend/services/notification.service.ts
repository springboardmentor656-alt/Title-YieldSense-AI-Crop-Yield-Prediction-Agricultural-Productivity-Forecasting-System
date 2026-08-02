import api from "@/lib/axios";

import { Notification } from "@/types/notification";

export const getNotifications = async (
    unreadOnly: boolean = false,
    limit?: number
): Promise<Notification[]> => {

    const params = new URLSearchParams({
        unread_only: String(unreadOnly),
    });

    if (limit !== undefined) {
        params.set("limit", String(limit));
    }

    const response = await api.get(`/notifications/?${params.toString()}`);

    return response.data;

};

export const getUnreadCount = async (): Promise<number> => {

    const response = await api.get("/notifications/unread-count");

    return response.data.unread_count;

};

export const markRead = async (id: number) => {

    const response = await api.patch(
        `/notifications/${id}/read`
    );

    return response.data;

};

export const markAllRead = async () => {

    const response = await api.patch("/notifications/read-all");

    return response.data;

};

export const deleteNotification = async (id: number) => {

    const response = await api.delete(
        `/notifications/${id}`
    );

    return response.data;

};
