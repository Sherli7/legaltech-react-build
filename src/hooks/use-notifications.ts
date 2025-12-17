import { useEffect, useState } from "react";
import { notificationsService } from "@/services";
import type { AppNotification } from "@/types/notifications";

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationsService.list();
      setItems(data);
    } catch (err: any) {
      setError(err?.message || "Impossible de récupérer les notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await notificationsService.markAsRead(id);
    } catch {
      // rollback if needed
    }
  };

  const markAllAsRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notificationsService.markAllAsRead();
    } catch {
      // ignore for mock
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    items,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount: items.filter((n) => !n.isRead).length,
  };
}
