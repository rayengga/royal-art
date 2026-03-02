export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          {/* Image skeleton */}
          <div className="aspect-square bg-gray-200 rounded-lg" />
          
          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
            <div className="h-12 bg-amber-200 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
