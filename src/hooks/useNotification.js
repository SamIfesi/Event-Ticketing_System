// useNotifications — in-app notification management.
//
// Covers:
//   - Fetching paginated notifications
//   - Polling unread count for the bell badge
//   - Marking one or all as read
//   - Deleting a notification
//
// Usage:
//   const { notifications, unreadCount, fetchNotifications, markRead, markAllRead } = useNotifications();

import { useState, useCallback, useEffect } from 'react';
import NotificationService from '../services/notification.service';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';

export function useNotifications({ pollInterval = 15000 } = {}) {
  const token = useAuthStore((s) => s.token);
  const toastError = useUiStore((s) => s.toastError);
  const toastSuccess = useUiStore((s) => s.toastSuccess);

  // ── Notification list ─────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // ── Unread count (bell badge) ─────────────────────────────────
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCountLoading, setUnreadCountLoading] = useState(false);

  // ── Mutation state ────────────────────────────────────────────
  const [mutating, setMutating] = useState(false);

  // ── Fetch paginated notifications ─────────────────────────────
  // ?unread=1 to show unread only
  const fetchNotifications = useCallback(async (params = {}) => {
    if (!token) return;

    setNotificationsLoading(true);
    try {
      const data = await NotificationService.getNotifications(params);
      setNotifications(data.notifications ?? []);
      setPagination(data.pagination ?? null);
      // Keep badge in sync with whatever the list returns
      if (data.unread_count != null) {
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Failed to load notifications.'
      );
    } finally {
      setNotificationsLoading(false);
    }
  }, [token, toastError]);

  // ── Fetch unread count only (lightweight, used for polling) ───
  const fetchUnreadCount = useCallback(async () => {
    if (!token) {
      setUnreadCount(0);
      return;
    }

    setUnreadCountLoading(true);
    try {
      const data = await NotificationService.getUnreadCount();
      setUnreadCount(data.unread_count ?? 0);
    } catch {
      // Silently fail — badge polling should never show a toast
    } finally {
      setUnreadCountLoading(false);
    }
  }, [token]);

  // ── Poll unread count every `pollInterval` ms ─────────────────
  // Default: every 30 seconds — cheap endpoint, keeps badge fresh
  useEffect(() => {
    if (!token) {
      return;
    }

    const initialFetchTimeout = setTimeout(() => {
      void fetchUnreadCount();
    }, 0);

    if (!pollInterval) return;

    const interval = setInterval(fetchUnreadCount, pollInterval);
    return () => {
      clearTimeout(initialFetchTimeout);
      clearInterval(interval);
    };
  }, [fetchUnreadCount, pollInterval, token]);

  const visibleUnreadCount = token ? unreadCount : 0;

  // ── Mark one notification as read ────────────────────────────
  const markRead = useCallback(async (id) => {
    setMutating(true);
    try {
      await NotificationService.markRead(id);
      // Optimistically update local state — no full re-fetch needed
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Failed to mark notification as read.'
      );
    } finally {
      setMutating(false);
    }
  }, [toastError]);

  // ── Mark all as read ──────────────────────────────────────────
  // Called when user opens the notification panel
  const markAllRead = useCallback(async () => {
    setMutating(true);
    try {
      const data = await NotificationService.markAllRead();
      // Optimistically mark everything in the local list as read
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
      if (data?.marked_read > 0) {
        toastSuccess(`${data.marked_read} notification(s) marked as read.`);
      }
    } catch (err) {
      toastError(
        err?.response?.data?.message ??
          'Failed to mark all notifications as read.'
      );
    } finally {
      setMutating(false);
    }
  }, [toastError, toastSuccess]);

  // ── Delete a notification ─────────────────────────────────────
  const deleteNotification = useCallback(async (id) => {
    setMutating(true);
    try {
      await NotificationService.deleteNotification(id);
      // Remove from local list immediately
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Failed to delete notification.'
      );
    } finally {
      setMutating(false);
    }
  }, [toastError]);

  return {
    // ── List
    notifications,
    pagination,
    notificationsLoading,
    fetchNotifications,

    // ── Bell badge
    unreadCount: visibleUnreadCount,
    unreadCountLoading,
    fetchUnreadCount,

    // ── Mutations
    mutating,
    markRead,
    markAllRead,
    deleteNotification,
  };
}
