import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventsService from '../services/events.service';
import { useUiStore } from '../store/uiStore';
import { PAGINATION } from '../config/constants';

export function useEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toastError = useUiStore((state) => state.toastError);

  // ── Read filter/pagination state from URL ─────────────────────
  const page = parseInt(
    searchParams.get('page') || PAGINATION.DEFAULT_PAGE,
    10
  );
  const limit = parseInt(
    searchParams.get('limit') || PAGINATION.DEFAULT_PER_PAGE,
    10
  );
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const date = searchParams.get('date') || '';

  // ── Local state ───────────────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Single event ──────────────────────────────────────────────
  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState(null);

  // ── Fetch list ────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EventsService.getEvents({
        page,
        limit,
        search,
        category,
        date,
      });
      setEvents(data.events);
      setPagination(data.pagination);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to load events.';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, date]);

  // Re-fetch whenever URL params change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ── Fetch single event ────────────────────────────────────────
  const fetchEvent = useCallback(async (id) => {
    setEventLoading(true);
    setEventError(null);
    try {
      const data = await EventsService.getEvent(id);
      setEvent(data.event);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Event not found.';
      setEventError(msg);
      toastError(msg);
    } finally {
      setEventLoading(false);
    }
  }, []);

  // ── URL param setters ─────────────────────────────────────────
  // These update the URL which triggers a re-fetch automatically.
  // Always reset to page 1 when a filter changes.

  function setPage(newPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  }

  function setSearch(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      next.set('page', '1');
      return next;
    });
  }

  function setCategory(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('category', value);
      else next.delete('category');
      next.set('page', '1');
      return next;
    });
  }

  function setDateFilter(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('date', value);
      else next.delete('date');
      next.set('page', '1');
      return next;
    });
  }

  function clearFilters() {
    setSearchParams({ page: '1' });
  }

  return {
    // ── List state
    events,
    pagination,
    loading,
    error,

    // ── Active filter values (read from URL — use these to populate filter UI)
    page,
    limit,
    search,
    category,
    date,

    // ── Filter/pagination setters
    setPage,
    setSearch,
    setCategory,
    setDateFilter,
    clearFilters,
    refetch: fetchEvents,

    // ── Single event state
    event,
    eventLoading,
    eventError,
    fetchEvent,
  };
}
