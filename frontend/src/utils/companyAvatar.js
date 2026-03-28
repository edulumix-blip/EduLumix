/** Tailwind classes: solid bg + white text (readable on all) */
const PALETTE = [
  'bg-rose-600 text-white',
  'bg-pink-600 text-white',
  'bg-fuchsia-600 text-white',
  'bg-purple-600 text-white',
  'bg-violet-600 text-white',
  'bg-indigo-600 text-white',
  'bg-blue-600 text-white',
  'bg-sky-600 text-white',
  'bg-cyan-600 text-white',
  'bg-teal-600 text-white',
  'bg-emerald-600 text-white',
  'bg-green-600 text-white',
  'bg-lime-700 text-white',
  'bg-amber-600 text-white',
  'bg-orange-600 text-white',
  'bg-red-600 text-white',
];

export function hashCompanyName(name) {
  const s = String(name || '').trim().toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * First display character for avatar (letter / digit / first grapheme).
 */
export function getCompanyInitial(companyName) {
  const s = String(companyName || '').trim();
  if (!s) return '?';
  const ch = s[0];
  if (/[a-zA-Z0-9]/.test(ch)) return ch.toUpperCase();
  return ch;
}

export function getCompanyAvatarColorClasses(companyName) {
  return PALETTE[hashCompanyName(companyName) % PALETTE.length];
}
