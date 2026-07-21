import api from "@/lib/axios";

export const getNotifications = async (
    unreadOnly: boolean = false
) => {

    const response = await api.get(
        `/notifications/?unread_only=${unreadOnly}`
    );

    return response.data;

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
