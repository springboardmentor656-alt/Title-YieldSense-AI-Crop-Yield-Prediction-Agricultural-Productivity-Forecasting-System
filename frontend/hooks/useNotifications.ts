"use client";

import { useEffect, useState } from "react";

import * as NotificationService from "@/services/notification.service";

import { toast } from "sonner";

export function useNotifications(unreadOnly: boolean = false) {

    const [notifications, setNotifications] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await NotificationService.getNotifications(
                unreadOnly
            );

            setNotifications(data);

        }

        catch {

            toast.error("Unable to load notifications");

        }

        finally {

            setLoading(false);

        }

    }

    async function markAsRead(id: number) {

        try {

            await NotificationService.markRead(id);

            load();

        }

        catch {

            toast.error("Unable to mark notification as read");

        }

    }

    async function markAllAsRead() {

        try {

            await NotificationService.markAllRead();

            toast.success("All notifications marked as read");

            load();

        }

        catch {

            toast.error("Unable to mark all notifications as read");

        }

    }

    async function remove(id: number) {

        try {

            await NotificationService.deleteNotification(id);

            toast.success("Notification deleted");

            load();

        }

        catch {

            toast.error("Unable to delete notification");

        }

    }

    useEffect(() => {

        load();

    }, [unreadOnly]);

    return {

        notifications,

        loading,

        markAsRead,

        markAllAsRead,

        remove,

        refresh: load,

    };

}
