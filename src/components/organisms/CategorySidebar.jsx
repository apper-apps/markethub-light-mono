import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const CategorySidebar = ({ 
  categories = [], 
  selectedCategory, 
  onCategorySelect,
  storeColor = "#3b82f6",
  className = "" 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
        Categories
      </h3>
      
      <div className="space-y-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
            !selectedCategory
              ? "text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          style={{
            backgroundColor: !selectedCategory ? storeColor : "transparent",
          }}
        >
          <ApperIcon name="Grid3X3" className="w-5 h-5" />
          <span className="font-medium">All Categories</span>
        </button>

        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCategorySelect(category)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
              selectedCategory === category
                ? "text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            style={{
              backgroundColor: selectedCategory === category ? storeColor : "transparent",
            }}
          >
            <ApperIcon name="Tag" className="w-5 h-5" />
            <span className="font-medium">{category}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default CategorySidebar