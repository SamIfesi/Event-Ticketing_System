// DownloadableTicket — premium downloadable ticket with PNG + PDF options.
//
// PNG:  html2canvas captures the hidden full-res ticket div → downloads as image
// PDF:  @react-pdf/renderer builds a real vector PDF → downloads as .pdf
//
// Both formats are theme-aware — reads document data-theme at download time
// so dark mode users get a dark ticket, light mode users get a light ticket.
//
// Usage:
//   <DownloadableTicket ticket={ticket} />

import { useRef, useState } from 'react';
import { Download, ImageIcon, FileText, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import {
  Document,
  Page,
  Text,
  View,
  Image as PDFImage,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { formatShortDate, formatTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import QRCodeDisplay from './QRCodeDisplay';

// ── Theme color sets ──────────────────────────────────────────
function getColors(isDark) {
  return isDark
    ? {
        cardBg:        '#151a23',
        pageBg:        '#0f1117',
        headerBg:      '#1e2433',
        primary:       '#f1f5f9',
        secondary:     '#94a3b8',
        muted:         '#475569',
        border:        '#1e2433',
        accentBg:      '#1e3a5f',
        accentText:    '#93c5fd',
        successBg:     '#052e16',
        successText:   '#4ade80',
        successBorder: '#14532d',
        usedBg:        '#1e2433',
        usedText:      '#64748b',
        usedBorder:    '#334155',
      }
    : {
        cardBg:        '#ffffff',
        pageBg:        '#f8fafc',
        headerBg:      '#f1f5f9',
        primary:       '#0f172a',
        secondary:     '#475569',
        muted:         '#94a3b8',
        border:        '#e2e8f0',
        accentBg:      '#eff6ff',
        accentText:    '#2563eb',
        successBg:     '#f0fdf4',
        successText:   '#16a34a',
        successBorder: '#bbf7d0',
        usedBg:        '#f8fafc',
        usedText:      '#94a3b8',
        usedBorder:    '#e2e8f0',
      };
}

// ─────────────────────────────────────────────────────────────
// PDF DOCUMENT (@react-pdf/renderer)
// ─────────────────────────────────────────────────────────────
function makePdfStyles(c) {
  return StyleSheet.create({
    page: {
      backgroundColor: c.pageBg,
      padding: 24,
      fontFamily: 'Helvetica',
    },
    card: {
      backgroundColor: c.cardBg,
      borderRadius: 16,
      overflow: 'hidden',
      border: `1px solid ${c.border}`,
    },
    header: {
      backgroundColor: c.headerBg,
      padding: '28 24 24',
      alignItems: 'center',
      borderBottom: `1px solid ${c.border}`,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Helvetica-Bold',
      color: c.primary,
      marginBottom: 6,
      textAlign: 'center',
    },
    headerSub: {
      fontSize: 12,
      color: c.secondary,
      textAlign: 'center',
    },
    perfRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    perfNotch: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: c.pageBg,
      border: `1px solid ${c.border}`,
      marginLeft: -9,
      marginRight: -9,
      zIndex: 1,
    },
    perfLine: {
      flex: 1,
      borderTop: `2px dashed ${c.border}`,
      marginHorizontal: 4,
    },
    body: {
      padding: '20 24',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    halfCol: {
      flex: 1,
    },
    label: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
      color: c.muted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 3,
    },
    value: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: c.primary,
    },
    monoValue: {
      fontSize: 14,
      fontFamily: 'Courier-Bold',
      color: c.primary,
    },
    refBox: {
      backgroundColor: c.accentBg,
      borderRadius: 10,
      padding: '10 14',
      marginTop: 4,
    },
    refLabel: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
      color: c.accentText,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 3,
    },
    refValue: {
      fontSize: 13,
      fontFamily: 'Courier-Bold',
      color: c.accentText,
    },
    divider: {
      borderTop: `1px solid ${c.border}`,
      marginHorizontal: 24,
    },
    qrSection: {
      padding: '20 24 28',
      alignItems: 'center',
    },
    qrLabel: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      color: c.muted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
    },
    qrBox: {
      width: 140,
      height: 140,
      backgroundColor: c.cardBg,
      border: `1px solid ${c.border}`,
      borderRadius: 12,
      padding: 8,
      marginBottom: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qrImage: {
      width: 124,
      height: 124,
      objectFit: 'contain',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 20,
      marginBottom: 10,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
    },
    footer: {
      fontSize: 10,
      color: c.muted,
      textAlign: 'center',
      marginTop: 4,
      letterSpacing: 0.5,
    },
  });
}

function TicketPDFDocument({ ticket, isDark }) {
  const c = getColors(isDark);
  const s = makePdfStyles(c);

  const event      = ticket?.event ?? {};
  const title      = ticket?.event_title ?? event?.title ?? 'Event';
  const startDate  = ticket?.event_start_date ?? event?.start_date;
  const location   = ticket?.event_location ?? event?.location;
  const holderName = ticket?.holder_name ?? ticket?.attendee_name;
  const ticketId   = ticket?.id ? `#${String(ticket.id).padStart(6, '0')}` : '—';
  const totalAmt   = ticket?.total_amount ?? ticket?.price;
  const bookingRef = ticket?.booking_id ? `#${String(ticket.booking_id).padStart(6, '0')}` : null;
  const isValid    = ticket?.status === 'valid';
  const isUsed     = ticket?.status === 'used';
  const statusLabel = isValid ? 'Valid' : isUsed ? 'Used' : ticket?.status ?? 'Unknown';

  const sc = isValid
    ? { bg: c.successBg, border: c.successBorder, text: c.successText, dot: c.successText }
    : { bg: c.usedBg,    border: c.usedBorder,    text: c.usedText,    dot: c.usedText    };

  return (
    <Document>
      <Page size={[448, 700]} style={s.page}>
        <View style={s.card}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerTitle}>🎉  Your ticket is ready!</Text>
            <Text style={s.headerSub}>{title}</Text>
          </View>

          {/* Top perforation */}
          <View style={s.perfRow}>
            <View style={s.perfNotch} />
            <View style={s.perfLine} />
            <View style={s.perfNotch} />
          </View>

          {/* Body */}
          <View style={s.body}>
            {/* ID + Amount */}
            <View style={s.row}>
              <View style={s.halfCol}>
                <Text style={s.label}>Ticket ID</Text>
                <Text style={s.monoValue}>{ticketId}</Text>
              </View>
              {totalAmt != null && (
                <View style={[s.halfCol, { alignItems: 'flex-end' }]}>
                  <Text style={s.label}>Amount</Text>
                  <Text style={s.value}>{formatCurrency(totalAmt)}</Text>
                </View>
              )}
            </View>

            {/* Date */}
            {startDate && (
              <View style={{ marginBottom: 16 }}>
                <Text style={s.label}>Date & time</Text>
                <Text style={s.value}>{formatShortDate(startDate)} · {formatTime(startDate)}</Text>
              </View>
            )}

            {/* Venue */}
            {location && (
              <View style={{ marginBottom: 16 }}>
                <Text style={s.label}>Venue</Text>
                <Text style={s.value}>{location}</Text>
              </View>
            )}

            {/* Type + Holder */}
            <View style={s.row}>
              <View style={s.halfCol}>
                <Text style={s.label}>Ticket type</Text>
                <Text style={[s.value, { fontSize: 13 }]}>{ticket?.ticket_type_name ?? 'General Admission'}</Text>
              </View>
              {holderName && (
                <View style={s.halfCol}>
                  <Text style={s.label}>Holder</Text>
                  <Text style={[s.value, { fontSize: 13 }]}>{holderName}</Text>
                </View>
              )}
            </View>

            {/* Booking ref */}
            {bookingRef && (
              <View style={s.refBox}>
                <Text style={s.refLabel}>Booking reference</Text>
                <Text style={s.refValue}>{bookingRef}</Text>
              </View>
            )}
          </View>

          <View style={s.divider} />

          {/* Bottom perforation */}
          <View style={s.perfRow}>
            <View style={s.perfNotch} />
            <View style={s.perfLine} />
            <View style={s.perfNotch} />
          </View>

          {/* QR section */}
          <View style={s.qrSection}>
            <Text style={s.qrLabel}>Scan at the gate</Text>
            <View style={s.qrBox}>
              {ticket?.qr_code_url ? (
                <PDFImage src={ticket.qr_code_url} style={s.qrImage} />
              ) : (
                <Text style={{ fontSize: 9, color: c.muted }}>QR not available</Text>
              )}
            </View>
            <View style={[s.statusBadge, { backgroundColor: sc.bg, border: `1px solid ${sc.border}` }]}>
              <View style={[s.statusDot, { backgroundColor: sc.dot }]} />
              <Text style={[s.statusText, { color: sc.text }]}>{statusLabel}</Text>
            </View>
            <Text style={s.footer}>Issued via Ticketer</Text>
          </View>

        </View>
      </Page>
    </Document>
  );
}

// ─────────────────────────────────────────────────────────────
// HTML TICKET CONTENT (for preview + PNG capture)
// ─────────────────────────────────────────────────────────────
function TicketHTMLContent({ ticket, isDark }) {
  const c = getColors(isDark);

  const event      = ticket?.event ?? {};
  const title      = ticket?.event_title ?? event?.title ?? 'Event';
  const startDate  = ticket?.event_start_date ?? event?.start_date;
  const location   = ticket?.event_location ?? event?.location;
  const holderName = ticket?.holder_name ?? ticket?.attendee_name;
  const ticketId   = ticket?.id ? `#${String(ticket.id).padStart(6, '0')}` : '—';
  const totalAmt   = ticket?.total_amount ?? ticket?.price;
  const bookingRef = ticket?.booking_id ? `#${String(ticket.booking_id).padStart(6, '0')}` : null;
  const isValid    = ticket?.status === 'valid';
  const isUsed     = ticket?.status === 'used';
  const statusLabel = isValid ? 'Valid' : isUsed ? 'Used' : ticket?.status ?? 'Unknown';

  const sc = isValid
    ? { bg: c.successBg, border: c.successBorder, text: c.successText, dot: c.successText }
    : { bg: c.usedBg,    border: c.usedBorder,    text: c.usedText,    dot: c.usedText    };

  const Perf = () => (
    <div style={{ display: 'flex', alignItems: 'center', margin: '0 -1px' }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: c.pageBg, border: `1px solid ${c.border}`, flexShrink: 0, marginLeft: -10, zIndex: 1 }} />
      <div style={{ flex: 1, borderTop: `2px dashed ${c.border}`, margin: '0 4px' }} />
      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: c.pageBg, border: `1px solid ${c.border}`, flexShrink: 0, marginRight: -10, zIndex: 1 }} />
    </div>
  );

  const labelStyle = { fontSize: 10, fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' };
  const valueStyle = { fontSize: 15, fontWeight: 700, color: c.primary, margin: 0 };
  // const subStyle   = { fontSize: 13, color: c.secondary, margin: '2px 0 0' };

  return (
    <div style={{ width: 400, fontFamily: "'system-ui', '-apple-system', sans-serif", backgroundColor: c.pageBg, padding: 24 }}>
      <div style={{ backgroundColor: c.cardBg, borderRadius: 20, overflow: 'hidden', border: `1px solid ${c.border}`, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.12)' }}>

        {/* Header */}
        <div style={{ backgroundColor: c.headerBg, padding: '28px 24px 24px', textAlign: 'center', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ fontSize: 36, marginBottom: 12, lineHeight: 1 }}>🎉</div>
          <p style={{ fontSize: 22, fontWeight: 700, color: c.primary, margin: '0 0 6px' }}>Your ticket is ready!</p>
          <p style={{ fontSize: 13, color: c.secondary, margin: 0, lineHeight: 1.5 }}>{title}</p>
        </div>

        <Perf />

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          {/* ID + Amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={labelStyle}>Ticket ID</p>
              <p style={{ ...valueStyle, fontFamily: 'monospace' }}>{ticketId}</p>
            </div>
            {totalAmt != null && (
              <div style={{ textAlign: 'right' }}>
                <p style={labelStyle}>Amount</p>
                <p style={valueStyle}>{formatCurrency(totalAmt)}</p>
              </div>
            )}
          </div>

          {/* Date */}
          {startDate && (
            <div style={{ marginBottom: 16 }}>
              <p style={labelStyle}>Date & time</p>
              <p style={valueStyle}>{formatShortDate(startDate)} · {formatTime(startDate)}</p>
            </div>
          )}

          {/* Venue */}
          {location && (
            <div style={{ marginBottom: 16 }}>
              <p style={labelStyle}>Venue</p>
              <p style={valueStyle}>{location}</p>
            </div>
          )}

          {/* Type + Holder */}
          <div style={{ display: 'flex', gap: 24, marginBottom: bookingRef ? 16 : 0 }}>
            <div style={{ flex: 1 }}>
              <p style={labelStyle}>Ticket type</p>
              <p style={{ ...valueStyle, fontSize: 14 }}>{ticket?.ticket_type_name ?? 'General Admission'}</p>
            </div>
            {holderName && (
              <div style={{ flex: 1 }}>
                <p style={labelStyle}>Holder</p>
                <p style={{ ...valueStyle, fontSize: 14 }}>{holderName}</p>
              </div>
            )}
          </div>

          {/* Booking ref */}
          {bookingRef && (
            <div style={{ backgroundColor: c.accentBg, borderRadius: 10, padding: '10px 14px', marginTop: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: c.accentText, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>Booking reference</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: c.accentText, margin: 0, fontFamily: 'monospace' }}>{bookingRef}</p>
            </div>
          )}
        </div>

        <div style={{ borderTop: `1px solid ${c.border}`, margin: '0 24px' }} />

        <Perf />

        {/* QR section */}
        <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Scan at the gate</p>
          {/* <div style={{ width: 160, height: 160, backgroundColor: c.cardBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}> */}
            {ticket?.qr_code_url ? (
              // <img src={ticket.qr_code_url} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
              <QRCodeDisplay 
                url={ticket?.qr_code_url}
                size={160}
                styley={{ width: '160', height: '160', backgroundColor: c.cardBg, borderRadius: 12, display: 'flex', alignItems: 'center',  justifyContent: 'center', padding: 8 }}
              />
            ) : (
              <svg width="120" height="120" viewBox="0 0 60 60" fill="none">
                <rect x="2" y="2" width="22" height="22" rx="2" fill="none" stroke={c.muted} strokeWidth="2"/>
                <rect x="6" y="6" width="14" height="14" rx="1" fill={c.muted}/>
                <rect x="36" y="2" width="22" height="22" rx="2" fill="none" stroke={c.muted} strokeWidth="2"/>
                <rect x="40" y="6" width="14" height="14" rx="1" fill={c.muted}/>
                <rect x="2" y="36" width="22" height="22" rx="2" fill="none" stroke={c.muted} strokeWidth="2"/>
                <rect x="6" y="40" width="14" height="14" rx="1" fill={c.muted}/>
                <rect x="36" y="36" width="6" height="6" fill={c.muted}/>
                <rect x="44" y="36" width="6" height="6" fill={c.muted}/>
                <rect x="52" y="36" width="6" height="6" fill={c.muted}/>
                <rect x="36" y="44" width="6" height="6" fill={c.muted}/>
                <rect x="52" y="44" width="6" height="6" fill={c.muted}/>
                <rect x="36" y="52" width="6" height="6" fill={c.muted}/>
                <rect x="44" y="52" width="6" height="6" fill={c.muted}/>
              </svg>
            )}
          {/* </div> */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block' }} />
            {statusLabel}
          </span>
          <p style={{ fontSize: 11, color: c.muted, margin: '4px 0 0', letterSpacing: '0.04em' }}>Issued via Ticketer</p>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function DownloadableTicket({ ticket }) {
  const downloadRef = useRef(null);
  const [pngLoading, setPngLoading]   = useState(false);
  const [pdfLoading, setPdfLoading]   = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);

  const isDark    = document.documentElement.getAttribute('data-theme') === 'dark';
  const ticketId  = ticket?.id ? String(ticket.id).padStart(6, '0') : 'ticket';
  const isLoading = pngLoading || pdfLoading;

  // ── PNG ───────────────────────────────────────────────────
  async function handlePNGDownload() {
    if (!downloadRef.current) return;
    setPngLoading(true);
    setMenuOpen(false);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(downloadRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDark ? '#0f1117' : '#f8fafc',
        logging: false,
      });
      const link    = document.createElement('a');
      link.download = `ticketer-${ticketId}.png`;
      link.href     = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('PNG download failed:', err);
    } finally {
      setPngLoading(false);
    }
  }

  // ── PDF ───────────────────────────────────────────────────
  async function handlePDFDownload() {
    setPdfLoading(true);
    setMenuOpen(false);
    try {
      const blob    = await pdf(<TicketPDFDocument ticket={ticket} isDark={isDark} />).toBlob();
      const url     = URL.createObjectURL(blob);
      const link    = document.createElement('a');
      link.download = `ticketer-${ticketId}.pdf`;
      link.href     = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Visible preview */}
      <div className="rounded-card overflow-hidden border border-border">
        <TicketHTMLContent ticket={ticket} isDark={isDark} />
      </div>

      {/* Download button + dropdown */}
      <div className="relative">
        <div className="flex rounded-btn overflow-hidden border border-accent">

          {/* Left: main label */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors duration-150 disabled:opacity-60 touch-manipulation"
          >
            {isLoading
              ? <Loader2 size={16} className="animate-spin" />
              : <Download size={16} strokeWidth={2.5} />
            }
            {pngLoading ? 'Saving image…' : pdfLoading ? 'Building PDF…' : 'Download ticket'}
          </button>

          {/* Right: chevron */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            disabled={isLoading}
            className="w-12 flex items-center justify-center bg-accent hover:bg-accent-hover text-white border-l border-white/20 transition-colors duration-150 disabled:opacity-60 touch-manipulation"
            aria-label="Choose download format"
          >
            {menuOpen
              ? <ChevronUp size={16} strokeWidth={2.5} />
              : <ChevronDown size={16} strokeWidth={2.5} />
            }
          </button>
        </div>

        {/* Format picker */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-card border border-border rounded-card shadow-lg overflow-hidden">

              {/* PNG */}
              <button
                onClick={handlePNGDownload}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-main-bg transition-colors duration-150 touch-manipulation text-left"
              >
                <div className="w-9 h-9 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
                  <ImageIcon size={16} className="text-accent" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Download as PNG</p>
                  <p className="text-xs text-muted mt-0.5">High-res image · Best for sharing</p>
                </div>
              </button>

              <div className="border-t border-border" />

              {/* PDF */}
              <button
                onClick={handlePDFDownload}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-main-bg transition-colors duration-150 touch-manipulation text-left"
              >
                <div className="w-9 h-9 rounded-btn bg-error/10 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-error" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Download as PDF</p>
                  <p className="text-xs text-muted mt-0.5">Vector quality · Best for printing</p>
                </div>
              </button>

            </div>
          </>
        )}
      </div>

      {/* Hidden full-res div — PNG capture target */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
        <div ref={downloadRef}>
          <TicketHTMLContent ticket={ticket} isDark={isDark} />
        </div>
      </div>

    </div>
  );
}