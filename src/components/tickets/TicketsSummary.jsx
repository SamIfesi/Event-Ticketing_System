// TicketsSummary — compact 3-stat strip shown above the ticket grid.
//
// Props:
//   tickets — full unfiltered array of ticket objects

export default function TicketsSummary({ tickets = [] }) {
  if (!tickets.length) return null;

  const total = tickets.length;
  const valid = tickets.filter((t) => t.status === 'valid').length;
  const used = tickets.filter((t) => t.status === 'used').length;
  const cancelled = tickets.filter(
    (t) => t.status === 'cancelled' || t.status === 'expired'
  ).length;

  const stats = [
    { label: 'Total', value: total, color: '#2563eb' },
    { label: 'Valid', value: valid, color: '#22c55e' },
    { label: 'Used', value: used, color: '#94a3b8' },
    { label: 'Cancelled', value: cancelled, color: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map(({ label, value, color }) => (
        <div
          key={label}
          className="bg-card border border-border rounded-card px-4 py-3 text-center"
        >
          <p className="text-xl font-black leading-none" style={{ color }}>
            {value}
          </p>
          <p className="text-[11px] text-muted mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
