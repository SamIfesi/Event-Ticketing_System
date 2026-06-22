import {
  Music,
  Cpu,
  Trophy,
  Briefcase,
  Utensils,
  BookOpen,
  Heart,
  Star,
  PartyPopper,
  Palette,
  Ticket,
} from 'lucide-react';

// Single source of truth for category → icon. Used by CategoryEventRow
// (row header) and CategoryEventCard (badge on the card) so they never
// drift out of sync. Falls back to a generic Ticket icon for anything
// unmapped — never render nothing.
export const CATEGORY_ICONS = {
  music: Music,
  technology: Cpu,
  tech: Cpu,
  sports: Trophy,
  business: Briefcase,
  food: Utensils,
  education: BookOpen,
  health: Heart,
  entertainment: Star,
  party: PartyPopper,
  arts: Palette,
  art: Palette,
};

export function getCategoryIcon(name) {
  const key = (name ?? '').toLowerCase().split(' ')[0];
  return CATEGORY_ICONS[key] ?? Ticket;
}
