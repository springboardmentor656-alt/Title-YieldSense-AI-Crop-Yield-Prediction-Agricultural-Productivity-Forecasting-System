"use client";

import { useEffect, useState } from "react";

import * as NotificationService from "@/services/notification.service";

import { Notification } from "@/types/notification";

import { toast } from "sonner";

const BELL_POLL_INTERVAL_MS = 30000;

export function useNotifications(unreadOnly: boolean = false, limit?: number) {

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await NotificationService.getNotifications(
                unreadOnly,
                limit
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unreadOnly, limit]);

    return {

        notifications,

        loading,

        markAsRead,

        markAllAsRead,

        remove,

        refresh: load,

    };

}

export function useUnreadCount() {

    const [count, setCount] = useState(0);

    async function load() {

        try {

            const data = await NotificationService.getUnreadCount();

            setCount(data);

        }

        catch {

            // Silent — the bell just keeps its last known count.

        }

    }

    useEffect(() => {

        load();

        const interval = setInterval(load, BELL_POLL_INTERVAL_MS);

        return () => clearInterval(interval);

    }, []);

    return { count, refresh: load };

}
