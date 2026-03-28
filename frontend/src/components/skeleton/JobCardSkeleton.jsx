const JobCardSkeleton = () => (
  <div className="flex flex-col bg-white dark:bg-dark-200 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-dark-100 dark:to-dark-800 animate-pulse" />
    <div className="p-5">
      <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded-md animate-pulse w-full max-w-[95%] mb-3" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-dark-100 animate-pulse shrink-0" />
        <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded-md animate-pulse flex-1 max-w-[50%]" />
      </div>
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded-md animate-pulse w-4/5 max-w-md mb-3" />
      <div className="flex items-center gap-2 flex-nowrap overflow-hidden">
        <div className="h-7 bg-gray-200 dark:bg-dark-100 rounded-full animate-pulse w-20 shrink-0" />
        <div className="h-7 bg-gray-200 dark:bg-dark-100 rounded-full animate-pulse w-28 shrink-0" />
        <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-24 shrink-0" />
      </div>
    </div>
    <div className="px-5 py-3.5 bg-gray-50/90 dark:bg-dark-100 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="h-9 w-14 bg-gray-200 dark:bg-dark-100 rounded-full animate-pulse" />
        <div className="h-9 w-9 bg-gray-200 dark:bg-dark-100 rounded-lg animate-pulse" />
      </div>
      <div className="h-9 w-28 bg-gray-200 dark:bg-dark-100 rounded-xl animate-pulse" />
    </div>
  </div>
);

export default JobCardSkeleton;
