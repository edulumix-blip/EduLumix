import { ChevronDown, RotateCcw } from 'lucide-react';

const selectBase =
  'w-full min-h-[44px] appearance-none rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 text-gray-900 dark:text-white text-sm font-medium py-3 pl-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/35 focus:border-blue-500 transition-shadow shadow-sm disabled:opacity-55 disabled:cursor-not-allowed';

const labelCls =
  'block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5';

/**
 * Config-driven advanced filters (native selects) for listing hubs.
 * @param {{ id: string, label: string, value: string, onChange: (v: string) => void, options: { value: string, label: string }[], gridClass?: string }[]} fields
 */
const ListingAdvancedFilters = ({
  title = 'Advanced filters',
  subtitle = 'Refine what you see — works on mobile and desktop',
  fields,
  optionsLoading,
  onReset,
  activeFilterCount,
}) => {
  const gridCols =
    fields.length <= 2
      ? 'sm:grid-cols-2'
      : fields.length <= 3
        ? 'sm:grid-cols-2 md:grid-cols-3'
        : fields.length <= 4
          ? 'sm:grid-cols-2 lg:grid-cols-4'
          : 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5';

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-dark-100/50 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={activeFilterCount === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0"
        >
          <RotateCcw className="w-4 h-4 shrink-0" aria-hidden />
          Clear filters
          {activeFilterCount > 0 ? (
            <span className="tabular-nums rounded-full bg-blue-600 text-white text-xs px-2 py-0.5 min-w-[1.25rem] text-center">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${gridCols}`}>
        {fields.map((field) => (
          <div key={field.id} className={`min-w-0 ${field.gridClass || ''}`}>
            <label htmlFor={field.id} className={labelCls}>
              {field.label}
            </label>
            <div className="relative">
              <select
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={optionsLoading || field.disabled}
                className={selectBase}
              >
                {field.options.map((opt) => (
                  <option key={`${field.id}-${opt.value}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingAdvancedFilters;
