export function formatEventDate(date){
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(date){
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(date){
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatEventDateTime(date){
  if (!date) return '';
  return `${formatShortDate(date)} . ${formatTime(date)}`;
}

export function formateRelativeTime(date){
  if (!date) return '';
  const diff = new Date(date) - new Date();
  const abs  = Math.abs(diff);
  const past = diff < 0;

  const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});
  if(abs < 60_000) return rtf.format(past ? -1 : 1, 'minute');
  if(abs < 3_600_000) return rtf.format(Math.round(diff / 60_000), 'minute');
  if(abs < 86_400_000) return rtf.format(Math.round(diff / 3_600_000), 'hour');
  if (abs < 7 * 86_400_000) return rtf.format(Math.round(diff / 86_400_000), 'day')
  if (abs < 30 * 86_400_000) return rtf.format(Math.round(diff / (7 * 86_400_000)), 'week');

  return formatShortDate(date);
}

export function isEventPast(date){
  if (!date) return false;
  return new Date(date) < new Date();
}

export function isEventSoon(data, hours = 24){
  if (!data) return false;
  const diff = new Date(data) - new Date();
  return diff > 0 && diff < hours * 3_600_000;
}