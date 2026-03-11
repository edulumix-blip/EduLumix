const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="h-40 bg-gray-200 dark:bg-dark-100 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-1/4" />
      <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-1/2" />
      <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded animate-pulse w-1/3" />
    </div>
    <div className="px-4 pb-4">
      <div className="h-9 bg-gray-200 dark:bg-dark-100 rounded-lg animate-pulse w-full" />
    </div>
  </div>
);

export default ProductCardSkeleton;
