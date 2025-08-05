import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] text-center p-8 ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-10 h-10 text-error-600" />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <div className="flex gap-4">
          <Button onClick={onRetry} className="flex items-center gap-2">
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
            Try Again
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Refresh Page
          </Button>
        </div>
      )}
    </div>
  )
}

export default Error