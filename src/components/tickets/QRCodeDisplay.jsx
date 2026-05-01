//  Renders a QR code image from a URL returned by the backend.
// The backend returns a qr_code_url (pre-generated image URL or data URI).
// Falls back to a placeholder when disabled or no URL provided.
//
// Props:
//   url      — qr_code_url from the ticket object
//   size     — pixel size (default 160)
//   disabled — grays out the QR when ticket is used/cancelled

export default function QRCodeDisplay({ url, size = 160, disabled = false }) {
  if (!url) {
    return (
      <div
        className="flex items-center justify-center bg-border rounded-card"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-muted text-center px-2">
          QR not available
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-card overflow-hidden border border-border transition-all duration-200 ${disabled ? 'grayscale opacity-40' : ''}`}
      style={{ width: size, height: size }}
    >
      <img
        src={url}
        alt="Ticket QR code"
        className="w-full h-full object-contain"
        draggable={false}
      />
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            Used
          </span>
        </div>
      )}
    </div>
  );
}
