const JobCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-dark-100 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-full" />
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-2/3" />
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-7 bg-gray-200 dark:bg-dark-100 rounded-full animate-pulse w-24" />
      <div className="h-7 bg-gray-200 dark:bg-dark-100 rounded-full animate-pulse w-32" />
    </div>
    <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
      <div className="h-9 bg-gray-200 dark:bg-dark-100 rounded-lg animate-pulse w-20" />
      <div className="h-9 bg-gray-200 dark:bg-dark-100 rounded-xl animate-pulse w-24" />
    </div>
  </div>
);

export default JobCardSkeleton;
