export default function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Image */}
      <div className="skeleton w-full aspect-video" />
      <div className="p-4 flex flex-col gap-3">
        {/* Source + date */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-20 rounded-full" />
          <div className="skeleton h-3 w-14 rounded-full" />
        </div>
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-4/5" />
          <div className="skeleton h-4 w-3/5" />
        </div>
        {/* Description */}
        <div className="flex flex-col gap-1">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}
