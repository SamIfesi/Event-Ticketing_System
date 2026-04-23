// useOrganizerEvents — organizer-scoped event management.
//
// Covers: myEvents, create, update, delete, eventBookings, checkinList.
// Assumes the consuming component is already behind ProtectedRoute + RoleRoute.
// This hook does not re-check roles — that is the route layer's job.

import { useState, useCallback } from 'react';
import { useUiStore } from '../store/uiStore';
import OrganizerService from '../services/organizer.service';

export function useOrganizerEvents() {
  const toastSuccess = useUiStore((state) => state.toastSuccess);
  const toastError   = useUiStore((state) => state.toastError);

  // ── My events list ────────────────────────────────────────────
  const [myEvents,       setMyEvents]       = useState([]);
  const [myEventsLoading, setMyEventsLoading] = useState(false);
  const [myEventsError,   setMyEventsError]   = useState(null);

  // ── Single event detail (for edit page) ──────────────────────
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Bookings for an event ─────────────────────────────────────
  const [bookings,        setBookings]        = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // ── Check-in list ─────────────────────────────────────────────
  const [checkinData,    setCheckinData]    = useState(null); // { summary, tickets[] }
  const [checkinLoading, setCheckinLoading] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────
  function resetErrors() {
    setError(null);
    setFieldErrors({});
  }

  function extractError(err) {
    const data = err?.response?.data;
    if (data?.errors) setFieldErrors(data.errors);
    const msg = data?.message ?? 'Something went wrong.';
    setError(msg);
    return msg;
  }

  // ── Fetch my events ───────────────────────────────────────────
  const fetchMyEvents = useCallback(async () => {
    setMyEventsLoading(true);
    setMyEventsError(null);
    try {
      const data = await OrganizerService.getMyEvents();
      setMyEvents(data.events);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to load your events.';
      setMyEventsError(msg);
      toastError(msg);
    } finally {
      setMyEventsLoading(false);
    }
  }, []);

  // ── Create event ──────────────────────────────────────────────
  // eventData shape: { title, description, location, category_id,
  //                    start_date, end_date, total_tickets, status,
  //                    banner_image, ticket_types[] }
  const createEvent = useCallback(async (eventData, { onSuccess } = {}) => {
    setLoading(true);
    resetErrors();
    try {
      const data = await OrganizerService.createEvent(eventData);
      toastSuccess('Event created successfully!');
      // Refresh my events list so the new event appears immediately
      await fetchMyEvents();
      onSuccess?.(data.event);
    } catch (err) {
      toastError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [fetchMyEvents]);

  // ── Update event ──────────────────────────────────────────────
  const updateEvent = useCallback(async (id, eventData, { onSuccess } = {}) => {
    setLoading(true);
    resetErrors();
    try {
      const data = await OrganizerService.updateEvent(id, eventData);
      toastSuccess('Event updated successfully!');
      // Update the item in the list without a full re-fetch
      setMyEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...data.event } : e))
      );
      onSuccess?.(data.event);
    } catch (err) {
      toastError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Delete (cancel) event ─────────────────────────────────────
  const deleteEvent = useCallback(async (id, { onSuccess } = {}) => {
    setLoading(true);
    resetErrors();
    try {
      await OrganizerService.deleteEvent(id);
      toastSuccess('Event cancelled.');
      // Remove from local list
      setMyEvents((prev) => prev.filter((e) => e.id !== id));
      onSuccess?.();
    } catch (err) {
      toastError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch event bookings ──────────────────────────────────────
  const fetchEventBookings = useCallback(async (eventId) => {
    setBookingsLoading(true);
    try {
      const data = await OrganizerService.getEventBookings(eventId);
      setBookings(data.bookings);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load bookings.');
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  // ── Fetch check-in list ───────────────────────────────────────
  const fetchCheckinList = useCallback(async (eventId) => {
    setCheckinLoading(true);
    try {
      const data = await OrganizerService.getCheckinList(eventId);
      setCheckinData(data);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load check-in list.');
    } finally {
      setCheckinLoading(false);
    }
  }, []);

  return {
    // ── My events
    myEvents,
    myEventsLoading,
    myEventsError,
    fetchMyEvents,

    // ── Mutations
    loading,
    error,
    fieldErrors,
    createEvent,
    updateEvent,
    deleteEvent,

    // ── Event bookings
    bookings,
    bookingsLoading,
    fetchEventBookings,

    // ── Check-in
    checkinData,
    checkinLoading,
    fetchCheckinList,
  };
}