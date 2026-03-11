const BlogCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-200 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-100 animate-pulse" />
        <div className="space-y-1 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-32" />
          <div className="h-3 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
    <div className="h-48 bg-gray-200 dark:bg-dark-100 animate-pulse mx-4 mb-3 rounded-xl" />
    <div className="px-4 pb-3 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-20" />
      <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-full" />
      <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-2/3" />
    </div>
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex justify-between">
      <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-16" />
      <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-24" />
    </div>
  </div>
);

export default BlogCardSkeleton;
