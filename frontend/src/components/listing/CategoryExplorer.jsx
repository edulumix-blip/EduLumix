import { ArrowRight } from 'lucide-react';

/**
 * Jobs-style category grid: image on top (no color overlay), icon + titles below.
 */
export default function CategoryExplorer({
  id = 'hub-categories-heading',
  title,
  subtitle,
  categories,
  selectedKey,
  onSelect,
  onViewAll,
  viewAllLabel = 'View all',
}) {
  return (
    <section className="mb-10" aria-labelledby={id}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 id={id} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-display">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.Icon;
          const active = selectedKey === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelect(cat.key)}
              className={`group relative text-left overflow-hidden rounded-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-300 ${
                active
                  ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/15'
                  : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
              }`}
            >
              <div className="relative h-24 sm:h-28 overflow-hidden bg-gray-100 dark:bg-dark-100">
                <img
                  src={cat.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="relative p-3 sm:p-4 bg-white dark:bg-dark-200">
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg ${cat.ring} ring-2`}
                >
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
                  {cat.shortTitle}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {cat.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
