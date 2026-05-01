// QR-code gate scanner for organizers.
// Uses html5-qrcode to access the device camera and scan ticket QR codes.
// Calls useTickets().checkin(qrToken) on each successful scan.
//
// Props:
//   eventId  — used for display purposes only
//   onCheckin — optional callback(result) after successful checkin

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Camera, RefreshCw } from 'lucide-react';
import { useTickets } from '../../hooks/useTickets';
import Button from '../ui/Button';

export default function CheckinScanner({ eventId, onCheckin }) {
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  const { checkin, checkinResult, checkinError, checkinLoading, resetCheckin } =
    useTickets();

  async function startScanner() {
    if (typeof window === 'undefined') return;

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      setError(null);
      setScanning(true);
      resetCheckin();

      const scanner = new Html5Qrcode('qr-scanner-container');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          await scanner.stop();
          setScanning(false);
          const data = await checkin(decodedText);
          onCheckin?.(data);
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
      setError(
        err?.message?.includes('Permission')
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Could not start scanner. Make sure your device has a camera.'
      );
    }
  }

  function handleReset() {
    resetCheckin();
    setError(null);
  }

  useEffect(() => {
    return () => {
      scannerRef.current?.stop?.().catch(() => {});
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      {/* Scanner viewport */}
      <div className="relative w-full aspect-square bg-black rounded-card overflow-hidden border border-border">
        <div
          id="qr-scanner-container"
          ref={containerRef}
          className="w-full h-full"
        />

        {/* Idle overlay */}
        {!scanning && !checkinResult && !checkinError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
            <Camera size={36} className="text-white/60" strokeWidth={1.5} />
            <p className="text-sm text-white/60 font-medium">Camera inactive</p>
          </div>
        )}

        {/* Scan frame overlay */}
        {scanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-52 h-52 border-2 border-accent rounded-card opacity-80" />
          </div>
        )}
      </div>

      {/* Result: success */}
      {checkinResult && (
        <div className="w-full p-4 bg-success/10 border border-success/30 rounded-card flex items-start gap-3">
          <CheckCircle2
            size={20}
            className="text-success shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <div>
            <p className="text-sm font-bold text-primary">
              {checkinResult.attendee_name} checked in!
            </p>
            <p className="text-xs text-secondary mt-0.5">
              {checkinResult.ticket_type} · {checkinResult.event_title}
            </p>
          </div>
        </div>
      )}

      {/* Result: error */}
      {(checkinError || error) && (
        <div className="w-full p-4 bg-error/10 border border-error/30 rounded-card flex items-start gap-3">
          <XCircle
            size={20}
            className="text-error shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-sm text-primary">{checkinError ?? error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 w-full">
        {!scanning ? (
          <Button
            variant="primary"
            size="md"
            icon={<Camera size={16} />}
            className="flex-1"
            loading={checkinLoading}
            onClick={startScanner}
          >
            {checkinResult || checkinError ? 'Scan next' : 'Start scanning'}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={() => {
              scannerRef.current?.stop?.().catch(() => {});
              setScanning(false);
            }}
          >
            Stop
          </Button>
        )}

        {(checkinResult || checkinError || error) && (
          <Button
            variant="ghost"
            size="md"
            icon={<RefreshCw size={15} />}
            onClick={handleReset}
          >
            Reset
          </Button>
        )}
      </div>

      <p className="text-xs text-muted text-center">
        Point the camera at a ticket QR code to check in an attendee.
      </p>
    </div>
  );
}
