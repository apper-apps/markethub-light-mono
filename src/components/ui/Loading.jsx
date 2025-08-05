import React from "react"
import { motion } from "framer-motion"

const Loading = ({ type = "page", className = "" }) => {
  if (type === "products") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card-premium overflow-hidden">
            <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-pulse" />
              <div className="flex justify-between items-center">
                <div className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "stores") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card-premium p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/4 animate-pulse" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "cart") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card-premium p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2 animate-pulse" />
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full" />
        <motion.div
          className="absolute inset-2 border-4 border-secondary-200 border-b-secondary-600 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  )
}

export default Loading