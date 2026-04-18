// useTickets — ticket viewing (attendee) and gate check-in (organizer).
//
// The checkin flow:
//   The organizer page uses html5-qrcode to scan a QR code from the camera.
//   When a code is detected, it calls checkin(qrToken).
//   The result (or error) is stored in checkinResult / checkinError
//   so the UI can display a clear success/failure message at the gate.

import { useState, useCallback } from 'react';
import TicketsService from '../services/tickets.service';
import { useUiStore } from '../store/uiStore';

export function useTickets() {
  const toastSuccess = useUiStore((state) => state.toastSuccess);
  const toastError   = useUiStore((state) => state.toastError);

  // ── Single ticket ─────────────────────────────────────────────
  const [ticket,        setTicket]        = useState(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError,   setTicketError]   = useState(null);

  // ── Tickets by booking ────────────────────────────────────────
  const [tickets,        setTickets]        = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // ── Check-in (organizer gate scanner) ────────────────────────
  // checkinResult holds the last scan result so the UI can display it.
  // It is not cleared automatically — the component decides when to reset it.
  const [checkinResult,  setCheckinResult]  = useState(null);
  const [checkinError,   setCheckinError]   = useState(null);
  const [checkinLoading, setCheckinLoading] = useState(false);

  // ── Fetch a single ticket ─────────────────────────────────────
  const fetchTicket = useCallback(async (id) => {
    setTicketLoading(true);
    setTicketError(null);
    try {
      const data = await TicketsService.getTicket(id);
      setTicket(data.ticket);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Ticket not found.';
      setTicketError(msg);
      toastError(msg);
    } finally {
      setTicketLoading(false);
    }
  }, []);

  // ── Fetch all tickets under a booking ─────────────────────────
  const fetchTicketsByBooking = useCallback(async (bookingId) => {
    setTicketsLoading(true);
    try {
      const data = await TicketsService.getTicketsByBooking(bookingId);
      setTickets(data.tickets);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Could not load tickets.');
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  // ── Check in a ticket (organizer gate scan) ───────────────────
  const checkin = useCallback(async (qrToken) => {
    setCheckinLoading(true);
    setCheckinResult(null);
    setCheckinError(null);
    try {
      const data = await TicketsService.checkin(qrToken);
      setCheckinResult(data);
      toastSuccess(`✓ ${data.attendee_name} checked in.`);
    } catch (err) {
      // Gate errors need to be very clear — show full backend message
      const msg = err?.response?.data?.message ?? 'Invalid ticket.';
      setCheckinError(msg);
      toastError(msg);
    } finally {
      setCheckinLoading(false);
    }
  }, []);

  function resetCheckin() {
    setCheckinResult(null);
    setCheckinError(null);
  }

  return {
    // ── Single ticket
    ticket,
    ticketLoading,
    ticketError,
    fetchTicket,

    // ── Tickets by booking
    tickets,
    ticketsLoading,
    fetchTicketsByBooking,

    // ── Check-in
    checkinResult,
    checkinError,
    checkinLoading,
    checkin,
    resetCheckin,
  };
}