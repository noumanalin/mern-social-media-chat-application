import React from 'react'

const FeedSkeleton = () => {
  return (
    <article className="p-4 rounded-md shadow-xl my-4 bg-white dark:bg-gray-600 animate-pulse space-y-4">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-500"></div>
        <div className="flex-1 space-y-2">
          <div className="w-32 h-4 bg-gray-300 dark:bg-gray-500 rounded"></div>
          <div className="w-24 h-3 bg-gray-200 dark:bg-gray-400 rounded"></div>
        </div>
      </header>

      {/* Body (text + image) */}
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-500 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-500 rounded"></div>
        <div className="h-64 w-full bg-gray-200 dark:bg-gray-500 rounded"></div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between mt-4">
        <div className="flex gap-4">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
        </div>
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
      </footer>
    </article>
  )
}

export default FeedSkeleton
