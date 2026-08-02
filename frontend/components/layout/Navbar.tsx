"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { Bell, Check, CheckCheck } from "lucide-react";

import { useNotifications, useUnreadCount } from "@/hooks/useNotifications";

const BELL_RECENT_LIMIT = 5;

export default function Navbar() {

    const [open, setOpen] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);

    const { count, refresh: refreshCount } = useUnreadCount();

    const {
        notifications,
        loading,
        markAsRead,
        markAllAsRead,
    } = useNotifications(false, BELL_RECENT_LIMIT);

    useEffect(() => {

        function handleClickOutside(event: MouseEvent) {

            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    async function handleMarkAllRead() {

        await markAllAsRead();
        await refreshCount();

    }

    async function handleMarkRead(id: number) {

        await markAsRead(id);
        await refreshCount();

    }

    return (
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-8">

            <h2 className="font-bold text-2xl">
                YieldSense AI
            </h2>

            <div className="flex gap-5 items-center">

                <div className="relative" ref={panelRef}>

                    <button
                        onClick={() => setOpen((prev) => !prev)}
                        className="relative"
                        aria-label="Notifications"
                    >
                        <Bell size={22} />

                        {count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {count > 9 ? "9+" : count}
                            </span>
                        )}
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50">

                            <div className="flex justify-between items-center px-4 py-3 border-b">
                                <span className="font-bold">Notifications</span>

                                <button
                                    onClick={handleMarkAllRead}
                                    className="flex items-center gap-1 text-xs text-green-700 hover:underline"
                                >
                                    <CheckCheck size={14} />
                                    Mark all read
                                </button>
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y">

                                {loading && (
                                    <p className="p-4 text-sm text-gray-500">Loading...</p>
                                )}

                                {!loading && notifications.length === 0 && (
                                    <p className="p-4 text-sm text-gray-500">
                                        No notifications yet.
                                    </p>
                                )}

                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`flex justify-between gap-2 p-3 ${
                                            !n.is_read ? "bg-green-50" : ""
                                        }`}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold">{n.title}</p>
                                            <p className="text-xs text-gray-500">{n.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(n.created_at).toLocaleString()}
                                            </p>
                                        </div>

                                        {!n.is_read && (
                                            <button
                                                onClick={() => handleMarkRead(n.id)}
                                                title="Mark as read"
                                                className="p-1 h-fit rounded hover:bg-gray-100 flex-shrink-0"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                            </div>

                            <Link
                                href="/dashboard/notifications"
                                onClick={() => setOpen(false)}
                                className="block text-center text-sm text-green-700 font-medium py-3 border-t hover:bg-green-50 rounded-b-xl"
                            >
                                View all
                            </Link>

                        </div>
                    )}

                </div>

                <img
                    src="https://ui-avatars.com/api/?name=Farmer"
                    className="w-10 h-10 rounded-full"
                />

            </div>

        </header>
    );
}
