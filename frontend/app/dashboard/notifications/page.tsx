"use client";

import { useState } from "react";

import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";

import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {

    const [filter, setFilter] = useState<"all" | "unread">("all");

    const {
        notifications,
        loading,
        markAsRead,
        markAllAsRead,
        remove,
    } = useNotifications(filter === "unread");

    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Bell size={32} />
                    Notifications
                </h1>

                <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                >
                    <CheckCheck size={18} />
                    Mark all read
                </button>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg ${
                        filter === "all"
                            ? "bg-green-900 text-white"
                            : "bg-white shadow-sm"
                    }`}
                >
                    All
                </button>

                <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-2 rounded-lg ${
                        filter === "unread"
                            ? "bg-green-900 text-white"
                            : "bg-white shadow-sm"
                    }`}
                >
                    Unread
                </button>
            </div>

            {loading && <p>Loading notifications...</p>}

            <div className="bg-white rounded-xl shadow-md divide-y">

                {!loading && notifications.length === 0 && (
                    <p className="p-6 text-gray-500">
                        No notifications to show.
                    </p>
                )}

                {notifications.map((n: any) => (
                    <div
                        key={n.id}
                        className={`flex justify-between items-center p-5 ${
                            !n.is_read ? "bg-green-50" : ""
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {!n.is_read && (
                                <span className="mt-2 w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
                            )}

                            <div>
                                <p
                                    className={
                                        !n.is_read
                                            ? "font-bold"
                                            : "font-medium"
                                    }
                                >
                                    {n.title}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {n.message}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(n.created_at).toLocaleString()}
                                    {" "}&bull;{" "}
                                    {n.category}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {!n.is_read && (
                                <button
                                    onClick={() => markAsRead(n.id)}
                                    title="Mark as read"
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Check size={18} />
                                </button>
                            )}

                            <button
                                onClick={() => remove(n.id)}
                                title="Delete"
                                className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    );

}
