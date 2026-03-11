/**
 * Formats job description for better readability.
 * Handles Adzuna/JSearch plain text with sections, bullets, and paragraphs.
 * Adzuna often has "Position: X Salary: Y Overview: Z" all inline - we split on these labels.
 */
const SECTION_NAMES = 'Position|Overview|Salary|Requirements|Responsibilities|About|Job Description|Description|Qualifications|Key Responsibilities|What You\'ll Do|Benefits|Work Schedule|Experience|Location';
const SECTION_LABELS = new RegExp(`^(${SECTION_NAMES}):?\\s*`, 'i');
const INLINE_SECTION = new RegExp(`\\s+(${SECTION_NAMES}):\\s*`, 'gi');

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  const withNewlines = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n');
  const doc = new DOMParser().parseFromString(withNewlines, 'text/html');
  return (doc.body?.textContent || html.replace(/<[^>]*>/g, '')).trim();
}

/** Split inline sections like "...component) Overview: We're..." into separate lines */
function normalizeSections(str) {
  return str.replace(INLINE_SECTION, '\n\n$1: ');
}

const BULLET_PATTERN = /^[\s]*[•\-\*]\s+/;
const NUMBERED_PATTERN = /^[\s]*\d+[\.\)]\s+/;

export default function FormattedJobDescription({ text, className = '' }) {
  if (!text || typeof text !== 'string') return null;

  let plainText = text.includes('<') ? stripHtml(text) : text;
  plainText = normalizeSections(plainText);
  const lines = plainText.split(/\n/).filter(Boolean);
  const elements = [];
  let listItems = [];
  let key = 0;

  const flushList = (items, ordered = false) => {
    if (items.length === 0) return;
    const ListTag = ordered ? 'ol' : 'ul';
    elements.push(
      <ListTag
        key={`list-${key++}`}
        className="list-disc list-inside space-y-1 my-3 text-gray-600 dark:text-gray-300"
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>
    );
    listItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(listItems);
      return;
    }

    const sectionMatch = trimmed.match(SECTION_LABELS);
    if (sectionMatch) {
      flushList(listItems);
      const label = sectionMatch[0].trim();
      const rest = trimmed.slice(label.length).trim();
      elements.push(
        <div key={`section-${key++}`} className="mt-4 first:mt-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
            {label.replace(/:$/, '')}
          </h3>
          {rest && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{rest}</p>
          )}
        </div>
      );
      return;
    }

    if (BULLET_PATTERN.test(trimmed) || NUMBERED_PATTERN.test(trimmed)) {
      const content = trimmed.replace(BULLET_PATTERN, '').replace(NUMBERED_PATTERN, '');
      listItems.push(content);
      return;
    }

    flushList(listItems);
    elements.push(
      <p key={`p-${key++}`} className="text-gray-600 dark:text-gray-300 leading-relaxed my-2">
        {trimmed}
      </p>
    );
  });

  flushList(listItems);

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
