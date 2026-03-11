const CourseCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-200 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
    <div className="h-48 bg-gray-200 dark:bg-dark-100 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-20" />
        <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-16" />
      </div>
      <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-4/5" />
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-1/2" />
      <div className="flex gap-4">
        <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-16" />
        <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-12" />
      </div>
    </div>
    <div className="p-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between">
      <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-16" />
      <div className="h-9 bg-gray-200 dark:bg-dark-100 rounded-lg animate-pulse w-28" />
    </div>
  </div>
);

export default CourseCardSkeleton;
