// useAdmin — admin dashboard and management actions.
//
// Pagination for users and events lists lives in the URL:
//   /admin/users?page=2&search=john&role=organizer
//   /admin/events?page=1&status=published
//
// This hook is only used inside RoleRoute-protected pages so
// no role check is needed here — that's the route layer's responsibility.

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminService from '../services/admin.service';
import { useUiStore } from '../store/uiStore';
import { PAGINATION } from '../config/constants';

export function useAdmin() {
  const toastSuccess = useUiStore((state) => state.toastSuccess);
  const toastError = useUiStore((state) => state.toastError);

  // ── Stats ─────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ── Users list ────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);

  // ── Single user ───────────────────────────────────────────────
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserLoading, setSelectedUserLoading] = useState(false);

  // ── Admin events list ─────────────────────────────────────────
  const [adminEvents, setAdminEvents] = useState([]);
  const [adminEventsPagination, setAdminEventsPagination] = useState(null);
  const [adminEventsLoading, setAdminEventsLoading] = useState(false);

  // ── Mutation state ─────────────────────────────────────────────
  const [mutating, setMutating] = useState(false);

  // ── URL params ────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();

  // Users params
  const usersPage = parseInt(
    searchParams.get('page') || PAGINATION.DEFAULT_PAGE,
    10
  );
  const usersLimit = parseInt(
    searchParams.get('limit') || PAGINATION.DEFAULT_PER_PAGE,
    10
  );
  const usersSearch = searchParams.get('search') || '';
  const usersRole = searchParams.get('role') || '';

  // Events params — uses a separate param prefix to avoid collision
  // when both lists might coexist on the same page in future
  const eventsPage = parseInt(
    searchParams.get('epage') || PAGINATION.DEFAULT_PAGE,
    10
  );
  const eventsLimit = parseInt(
    searchParams.get('elimit') || PAGINATION.DEFAULT_PER_PAGE,
    10
  );
  const eventsStatus = searchParams.get('status') || '';

  // ── Fetch dashboard stats ─────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await AdminService.getStats();
      setStats(data);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load stats.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Fetch users ───────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await AdminService.getUsers({
        page: usersPage,
        limit: usersLimit,
        search: usersSearch,
        role: usersRole,
      });
      setUsers(data.users);
      setUsersPagination(data.pagination);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load users.');
    } finally {
      setUsersLoading(false);
    }
  }, [usersPage, usersLimit, usersSearch, usersRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Fetch single user ─────────────────────────────────────────
  const fetchUser = useCallback(async (id) => {
    setSelectedUserLoading(true);
    try {
      const data = await AdminService.getUser(id);
      setSelectedUser(data.user);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'User not found.');
    } finally {
      setSelectedUserLoading(false);
    }
  }, []);

  // ── Update user role ──────────────────────────────────────────
  const updateUserRole = useCallback(
    async (id, role) => {
      setMutating(true);
      try {
        await AdminService.updateUserRole(id, role);
        toastSuccess(`Role updated to "${role}".`);
        // Patch local state so the UI updates without a full re-fetch
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
        if (selectedUser?.id === id) {
          setSelectedUser((prev) => ({ ...prev, role }));
        }
      } catch (err) {
        toastError(err?.response?.data?.message ?? 'Failed to update role.');
      } finally {
        setMutating(false);
      }
    },
    [selectedUser]
  );

  // ── Update user status ────────────────────────────────────────
  const updateUserStatus = useCallback(
    async (id, isActive) => {
      setMutating(true);
      try {
        await AdminService.updateUserStatus(id, isActive);
        const label = isActive ? 'activated' : 'deactivated';
        toastSuccess(`Account ${label}.`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, is_active: isActive ? 1 : 0 } : u
          )
        );
        if (selectedUser?.id === id) {
          setSelectedUser((prev) => ({ ...prev, is_active: isActive ? 1 : 0 }));
        }
      } catch (err) {
        toastError(err?.response?.data?.message ?? 'Failed to update status.');
      } finally {
        setMutating(false);
      }
    },
    [selectedUser]
  );

  // ── Fetch admin events list ───────────────────────────────────
  const fetchAdminEvents = useCallback(async () => {
    setAdminEventsLoading(true);
    try {
      const data = await AdminService.getEvents({
        page: eventsPage,
        limit: eventsLimit,
        status: eventsStatus,
      });
      setAdminEvents(data.events);
      setAdminEventsPagination(data.pagination);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load events.');
    } finally {
      setAdminEventsLoading(false);
    }
  }, [eventsPage, eventsLimit, eventsStatus]);

  useEffect(() => {
    fetchAdminEvents();
  }, [fetchAdminEvents]);

  // ── Update event status ───────────────────────────────────────
  const updateEventStatus = useCallback(async (id, status) => {
    setMutating(true);
    try {
      await AdminService.updateEventStatus(id, status);
      toastSuccess(`Event status set to "${status}".`);
      setAdminEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Failed to update event status.'
      );
    } finally {
      setMutating(false);
    }
  }, []);

  // ── URL param setters ─────────────────────────────────────────
  function setUsersPage(page) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
  }

  function setUsersSearch(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      next.set('page', '1');
      return next;
    });
  }

  function setUsersRoleFilter(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('role', value);
      else next.delete('role');
      next.set('page', '1');
      return next;
    });
  }

  function setEventsPage(page) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('epage', String(page));
      return next;
    });
  }

  function setEventsStatusFilter(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('status', value);
      else next.delete('status');
      next.set('epage', '1');
      return next;
    });
  }

  return {
    // ── Stats
    stats,
    statsLoading,
    fetchStats,

    // ── Users list
    users,
    usersPagination,
    usersLoading,
    usersPage,
    usersSearch,
    usersRole,
    setUsersPage,
    setUsersSearch,
    setUsersRoleFilter,
    fetchUsers,

    // ── Single user
    selectedUser,
    selectedUserLoading,
    fetchUser,

    // ── User mutations
    mutating,
    updateUserRole,
    updateUserStatus,

    // ── Admin events list
    adminEvents,
    adminEventsPagination,
    adminEventsLoading,
    eventsPage,
    eventsStatus,
    setEventsPage,
    setEventsStatusFilter,
    fetchAdminEvents,

    // ── Event mutations
    updateEventStatus,
  };
}
