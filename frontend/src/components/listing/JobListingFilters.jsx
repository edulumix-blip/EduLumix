import { ChevronDown, RotateCcw } from 'lucide-react';

const selectBase =
  'w-full min-h-[44px] appearance-none rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 text-gray-900 dark:text-white text-sm font-medium py-3 pl-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/35 focus:border-blue-500 transition-shadow shadow-sm disabled:opacity-55 disabled:cursor-not-allowed';

const labelCls =
  'block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5';

/**
 * Responsive advanced filters for /jobs — native selects for mobile + desktop.
 */
const JobListingFilters = ({
  category,
  onCategoryChange,
  city,
  onCityChange,
  location: locationValue,
  onLocationChange,
  experience,
  onExperienceChange,
  status,
  onStatusChange,
  categories,
  cities,
  locations,
  experiences,
  optionsLoading,
  onReset,
  activeFilterCount,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-dark-100/50 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Advanced filters</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Narrow results by category, city, location, experience, or status
          </p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <div className="min-w-0">
          <label htmlFor="job-filter-category" className={labelCls}>
            Category
          </label>
          <div className="relative">
            <select
              id="job-filter-category"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={optionsLoading}
              className={selectBase}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All categories' : c}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden
            />
          </div>
        </div>

        <div className="min-w-0">
          <label htmlFor="job-filter-city" className={labelCls}>
            City
          </label>
          <div className="relative">
            <select
              id="job-filter-city"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              disabled={optionsLoading}
              className={selectBase}
            >
              <option value="All">All cities</option>
              {cities.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden
            />
          </div>
        </div>

        <div className="min-w-0 md:col-span-1 xl:col-span-1">
          <label htmlFor="job-filter-location" className={labelCls}>
            Full location
          </label>
          <div className="relative">
            <select
              id="job-filter-location"
              value={locationValue}
              onChange={(e) => onLocationChange(e.target.value)}
              disabled={optionsLoading}
              className={selectBase}
            >
              <option value="All">Any full address</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden
            />
          </div>
        </div>

        <div className="min-w-0">
          <label htmlFor="job-filter-experience" className={labelCls}>
            Experience
          </label>
          <div className="relative">
            <select
              id="job-filter-experience"
              value={experience}
              onChange={(e) => onExperienceChange(e.target.value)}
              disabled={optionsLoading}
              className={selectBase}
            >
              <option value="All">All levels</option>
              {experiences.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden
            />
          </div>
        </div>

        <div className="min-w-0 sm:col-span-2 md:col-span-1 xl:col-span-1">
          <label htmlFor="job-filter-status" className={labelCls}>
            Application status
          </label>
          <div className="relative">
            <select
              id="job-filter-status"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              disabled={optionsLoading}
              className={selectBase}
            >
              <option value="All">Open and closed</option>
              <option value="Open">Open only</option>
              <option value="Closed">Closed only</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingFilters;
