export function sanitize(str) {
  const d = document.createElement('div');
  d.textContent = str == null ? '' : String(str);
  return d.innerHTML;
}
export function escapeAttr(str) {
  return sanitize(str).replace(/"/g, '&quot;');
}
export function fmtId() {
  return 'km_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
export function fmtDate(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
export function fmtDateTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return p(d.getHours()) + ':' + p(d.getMinutes());
  const sameYear = d.getFullYear() === now.getFullYear();
  return sameYear
    ? p(d.getDate()) + '/' + p(d.getMonth() + 1)
    : fmtDate(ts);
}