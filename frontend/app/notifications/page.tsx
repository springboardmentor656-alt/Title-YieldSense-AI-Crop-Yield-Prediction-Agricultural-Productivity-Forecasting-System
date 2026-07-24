"use client";

import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  const markOneRead = async (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
    );
    try {
      await api.markAlertRead(id);
    } catch (err: any) {
      alert(err.message);
      loadAlerts();
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    setMarking(true);
    const prevAlerts = alerts;
    setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
    try {
      await api.markAllAlertsRead();
    } catch (err: any) {
      alert(err.message);
      setAlerts(prevAlerts);
    } finally {
      setMarking(false);
    }
  };

  const removeAlert = async (id: number) => {
    const prevAlerts = alerts;
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    try {
      await api.deleteAlert(id);
    } catch (err: any) {
      alert(err.message);
      setAlerts(prevAlerts);
    }
  };

  return (
    <div className="min-h-screen bg-[#07160B] p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Bell size={32} className="text-green-500" />
            Notifications
          </h1>
          <p className="text-gray-400 mt-2">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "You're all caught up"}
          </p>
        </div>

        <button
          onClick={markAllRead}
          disabled={unreadCount === 0 || marking}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-[#1B4D2A] disabled:text-gray-500 disabled:cursor-not-allowed px-5 py-3 rounded-xl transition"
        >
          <CheckCheck size={18} />
          {marking ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#0D2311] border border-[#1B4D2A] rounded-xl p-5 animate-pulse h-20"
            />
          ))
        ) : alerts.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#0D2311] flex items-center justify-center border border-[#1B4D2A]">
              <Bell size={42} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mt-6">No notifications</h2>
            <p className="text-gray-400 mt-2">
              We'll let you know when something needs your attention.
            </p>
          </div>
        ) : (
          alerts.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between gap-4 rounded-xl p-5 border transition ${
                n.is_read
                  ? "bg-[#0D2311] border-[#1B4D2A]"
                  : "bg-[#12291A] border-green-700"
              }`}
            >
              <div className="flex gap-3 flex-1">
                {!n.is_read && (
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{n.message}</p>
                  <p className="text-gray-600 text-xs mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                {!n.is_read && (
                  <button
                    onClick={() => markOneRead(n.id)}
                    title="Mark as read"
                    className="p-2 rounded-lg hover:bg-[#17351E] text-green-400"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => removeAlert(n.id)}
                  title="Delete"
                  className="p-2 rounded-lg hover:bg-[#17351E] text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}