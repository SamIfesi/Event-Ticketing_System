import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Camera, RefreshCw } from 'lucide-react';
import { useTickets } from '../../hooks/useTickets';
import Button from '../ui/Button';

export default function CheckinScanner({ eventId, event, onCheckin }) {
  const isMultiDay = event?.checkin_mode === 'multi_day';
  const totalDays = event?.checkin_days ?? 1;
  const [day, setDay] = useState(1);
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const scannerStateRef = useRef('IDLE');
  const [scanning, setScanning] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [error, setError] = useState(null);

  const { checkin, checkinResult, checkinError, checkinLoading, resetCheckin } =
    useTickets();

  async function startScanner() {
    if (typeof window === 'undefined') return;
    if (scannerStateRef.current !== 'IDLE') return;

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      setError(null);
      resetCheckin();

      scannerStateRef.current = 'STARTING';
      setCameraLoading(true);

      const scanner = new Html5Qrcode('qr-scanner-container');
      scannerRef.current = scanner;

      // High-resolution configuration for crisp scanning
      const qrConfig = {
        fps: 15, // 15 FPS optimizes frame clarity and processing speed
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0, // Matches the aspect-square container ratio
        videoConstraints: {
          facingMode: 'environment', // Request main rear camera
          width: { min: 1280, ideal: 1920, max: 3840 }, // Target 1080p Full HD (min 720p HD)
          height: { min: 720, ideal: 1080, max: 2160 },
          focusMode: 'continuous', // Continuous focus on mobile hardware
        },
      };

      await scanner.start(
        { facingMode: 'environment' },
        qrConfig,
        async (decodedText) => {
          await stopScanner();
          const data = await checkin(decodedText, isMultiDay ? day : null, eventId);
          onCheckin?.(data, isMultiDay ? day : null);
        },
        () => {}
      );

      if (scannerStateRef.current === 'UNMOUNTED') {
        await scanner.stop().catch(() => {});
        setCameraLoading(false);
        return;
      }

      scannerStateRef.current = 'SCANNING';
      setScanning(true);
      setCameraLoading(false);
    } catch (err) {
      console.error('[Scanner Trace]: Initialization caught an error:', err);
      scannerStateRef.current = 'IDLE';
      setScanning(false);
      setCameraLoading(false);

      setError(
        !window.isSecureContext
          ? 'Camera access requires a secure context (HTTPS). Please use HTTPS or localhost.'
          : err?.message?.includes('Permission') ||
              err?.toString().includes('NotAllowedError')
            ? 'Camera permission denied. Please allow camera access and try again.'
            : err?.message || 'Could not start scanner. Make sure your device has a camera.'
      );
    }
  }

  async function stopScanner() {
    if (scannerRef.current && scannerStateRef.current === 'SCANNING') {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        if (!err?.toString().includes('not running')) {
          console.error('Scanner stop warning:', err);
        }
      }
    }
    if (scannerStateRef.current !== 'UNMOUNTED') {
      scannerStateRef.current = 'IDLE';
    }
    setScanning(false);
    setCameraLoading(false);
  }

  function handleReset() {
    resetCheckin();
    setError(null);
    setCameraLoading(false);
  }

  useEffect(() => {
    scannerStateRef.current = 'IDLE';
    return () => {
      const instance = scannerRef.current;
      const stage = scannerStateRef.current;
      scannerStateRef.current = 'UNMOUNTED';
      if (instance && stage === 'SCANNING') {
        instance.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      {/* Day selector for multi-day events */}
      {isMultiDay && (
        <div className="flex gap-2 w-full">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              className={`flex-1 h-10 rounded-btn text-xs font-semibold border transition-colors ${
                day === d
                  ? 'bg-accent text-white border-accent'
                  : 'bg-card text-secondary border-border hover:border-accent/40'
              }`}
            >
              Day {d}/{totalDays}
            </button>
          ))}
        </div>
      )}

      {/* Scanner viewport */}
      <div className="relative w-full aspect-square bg-black rounded-card overflow-hidden border border-border">
        <div
          id="qr-scanner-container"
          ref={containerRef}
          className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
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
            loading={checkinLoading || cameraLoading}
            onClick={startScanner}
          >
            {checkinResult || checkinError ? 'Scan next' : 'Start scanning'}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={stopScanner}
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
