const ResourceCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="aspect-video bg-gray-200 dark:bg-dark-100 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-4/5" />
      <div className="h-3 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-full" />
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-3/4" />
    </div>
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex justify-between">
      <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-24" />
      <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-16" />
    </div>
  </div>
);

export default ResourceCardSkeleton;
