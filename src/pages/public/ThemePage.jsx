import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Monitor, CheckCircle2 } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import Button from '../../components/ui/Button';

const OPTIONS = [
  {
    value: 'light',
    label: 'Light Mode',
    description: 'Always use the light theme.',
    icon: Sun,
    iconColor: '#f59e0b',
  },
  {
    value: 'dark',
    label: 'Dark Mode',
    description: 'Always use the dark theme.',
    icon: Moon,
    iconColor: '#8b5cf6',
  },
  {
    value: 'system',
    label: 'System Default',
    description:
      'Ticketer will switch dark mode on/off to match your device settings.',
    icon: Monitor,
    iconColor: '#2563eb',
  },
];

function ThemeOption({ option, selected, onSelect }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-main-bg active:bg-border touch-manipulation ${
        selected ? 'bg-main-bg' : ''
      }`}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-btn flex items-center justify-center shrink-0"
        style={{ background: `${option.iconColor}18` }}
      >
        <Icon
          size={18}
          strokeWidth={1.75}
          style={{ color: option.iconColor }}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary leading-snug">
          {option.label}
        </p>
        <p className="text-xs text-muted mt-0.5 leading-snug">
          {option.description}
        </p>
      </div>

      {/* Radio circle — PalmPay style */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
          selected ? 'border-accent bg-accent' : 'border-border bg-transparent'
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}

// Live preview strip showing what the current selection looks like
function ThemePreview({ selected }) {
  const isDark = selected === 'dark' || (selected === 'system' && false);

  return (
    <div
      className={`rounded-card border border-border overflow-hidden ${
        selected === 'dark'
          ? 'bg-[#151a23]'
          : selected === 'system'
            ? 'bg-card'
            : 'bg-white'
      }`}
    >
      {/* Mock header */}
      <div
        className={`h-10 flex items-center px-4 gap-2 border-b ${
          selected === 'dark'
            ? 'border-[#1e2433] bg-[#151a23]'
            : 'border-border bg-white'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full ${
            selected === 'dark' ? 'bg-[#1e2433]' : 'bg-border'
          }`}
        />
        <div
          className={`h-2 rounded flex-1 ${
            selected === 'dark' ? 'bg-[#1e2433]' : 'bg-border'
          }`}
        />
        <div className="w-5 h-5 rounded-full bg-accent opacity-80" />
      </div>

      {/* Mock content */}
      <div className="p-4 flex flex-col gap-2">
        <div
          className={`h-3 rounded w-3/4 ${
            selected === 'dark' ? 'bg-[#1e2433]' : 'bg-border'
          }`}
        />
        <div
          className={`h-2 rounded w-full ${
            selected === 'dark' ? 'bg-[#1e2433]/60' : 'bg-border/60'
          }`}
        />
        <div
          className={`h-2 rounded w-2/3 ${
            selected === 'dark' ? 'bg-[#1e2433]/60' : 'bg-border/60'
          }`}
        />
        <div className="mt-1 h-6 rounded-btn bg-accent w-24 opacity-80" />
      </div>
    </div>
  );
}

export default function ThemePage() {
  const navigate = useNavigate();

  const { theme, setTheme } = useThemeStore();

  // Local selection — only committed on "Save"
  const [selected, setSelected] = useState(theme);
  const isDirty = selected !== theme;

  function handleSave() {
    setTheme(selected);
    navigate(-1);
  }

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8">
        {/* Header row — mirrors PalmPay exactly */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back
          </button>

          <h1 className="text-base font-bold text-primary">Theme</h1>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
            className="min-w-[60px]"
          >
            Save
          </Button>
        </div>

        {/* Live preview */}
        <div className="mb-6">
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3 px-1">
            Preview
          </p>
          <ThemePreview selected={selected} />
        </div>

        {/* Options list — styled like PalmPay */}
        <div className="mb-2">
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2 px-1">
            Select manually
          </p>
        </div>
        <div className="bg-card border border-border rounded-card overflow-hidden divide-y divide-border">
          {OPTIONS.map((opt) => (
            <ThemeOption
              key={opt.value}
              option={opt}
              selected={selected === opt.value}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* Helper note */}
        <p className="mt-4 text-xs text-muted text-center leading-relaxed px-4">
          {selected === 'system'
            ? "Ticketer will automatically match your device's light/dark preference."
            : selected === 'dark'
              ? 'Dark mode reduces eye strain in low-light environments.'
              : 'Light mode is optimised for bright environments.'}
        </p>
      </main>
    </div>
  );
}
