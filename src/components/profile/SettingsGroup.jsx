// SettingsGroup — wraps a set of SettingsItems in a card with optional section label.
//
// Props:
//   title    — section label above the card (optional)
//   children — SettingsItem nodes

export default function SettingsGroup({ title, children }) {
  const items = Array.isArray(children)
    ? children.filter(Boolean)
    : [children].filter(Boolean);

  return (
    <div>
      {title && (
        <p className="px-1 pb-2 text-[11px] font-bold text-muted uppercase tracking-widest">
          {title}
        </p>
      )}
      <div className="bg-card border border-border rounded-card overflow-hidden divide-y divide-border">
        {items}
      </div>
    </div>
  );
}
