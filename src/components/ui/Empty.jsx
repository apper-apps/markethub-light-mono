import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  icon = "Package", 
  title = "No items found", 
  message = "It looks like there's nothing here yet. Start exploring to find what you're looking for!",
  actionText = "Browse Products",
  actionPath = "/",
  className = "" 
}) => {
  const navigate = useNavigate()

  const handleAction = () => {
    if (actionPath) {
      navigate(actionPath)
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] text-center p-8 ${className}`}>
      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-primary-600" />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {actionText && (
        <div className="flex gap-4">
          <Button onClick={handleAction} className="flex items-center gap-2">
            <ApperIcon name="ShoppingBag" className="w-4 h-4" />
            {actionText}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Empty