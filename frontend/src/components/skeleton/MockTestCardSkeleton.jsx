const MockTestCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="h-32 bg-gray-200 dark:bg-dark-100 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-20" />
        <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-16" />
      </div>
      <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-4/5" />
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-full" />
      <div className="flex gap-4">
        <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-20" />
        <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-16" />
        <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-12" />
      </div>
    </div>
    <div className="px-5 pb-5">
      <div className="h-10 bg-gray-200 dark:bg-dark-100 rounded-xl animate-pulse w-full" />
    </div>
  </div>
);

export default MockTestCardSkeleton;
