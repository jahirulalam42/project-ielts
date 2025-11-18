"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBell, FaCheck, FaEnvelopeOpen, FaInbox } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  link?: string;
  createdAt: string;
  isRead: boolean;
}

const typeBadgeClasses: Record<Notification["type"], string> = {
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  urgent: "badge-error",
};

const NotificationBell = () => {
  const { status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      setLoading(true);
      const res = await fetch("/api/notifications?limit=20");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch notifications");
      }
      setNotifications(data.data || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-read" }),
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle text-slate-600 hover:bg-slate-100"
      >
        <div className="indicator">
          <FaBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="badge badge-error badge-xs indicator-item"></span>
          )}
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[100] mt-3 card card-compact w-80 bg-base-100 shadow-xl border border-slate-100"
      >
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                className="btn btn-ghost btn-xs"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
              >
                <FaCheck className="mr-1" />
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <span className="loading loading-spinner text-primary" />
            </div>
          ) : error ? (
            <p className="text-sm text-error py-4">{error}</p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-slate-500">
              <FaInbox className="text-3xl mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-3 mt-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 rounded-xl border text-sm ${
                    notification.isRead
                      ? "bg-slate-50 border-slate-100"
                      : "bg-indigo-50/80 border-indigo-100"
                  }`}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800">{notification.title}</p>
                    <span className={`badge ${typeBadgeClasses[notification.type]}`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 whitespace-pre-line">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatTimeAgo(notification.createdAt)}</span>
                    {!notification.isRead ? (
                      <span className="flex items-center gap-1 text-primary">
                        <FaEnvelopeOpen />
                        Unread
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400">
                        <FaCheck />
                        Seen
                      </span>
                    )}
                  </div>
                  {notification.link && (
                    <a
                      href={notification.link}
                      target="_blank"
                      rel="noreferrer"
                      className="link link-primary text-xs mt-2 inline-block"
                    >
                      Open link
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;

