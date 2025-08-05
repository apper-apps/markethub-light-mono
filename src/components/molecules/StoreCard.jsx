import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const StoreCard = ({ store, featuredProducts = [], className = "" }) => {
  const navigate = useNavigate()

  const handleStoreClick = () => {
    navigate(`/store/${store.Id}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`card-premium cursor-pointer group overflow-hidden ${className}`}
      onClick={handleStoreClick}
      style={{ 
        background: `linear-gradient(135deg, ${store.themeColor}15 0%, ${store.themeColor}05 100%)`,
        borderColor: `${store.themeColor}30`
      }}
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: `${store.themeColor}20` }}
          >
            <ApperIcon 
              name={store.icon} 
              className="w-8 h-8"
              style={{ color: store.themeColor }}
            />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              {store.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {store.description}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Categories:</h4>
          <div className="flex flex-wrap gap-2">
            {store.categories.slice(0, 4).map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white border rounded-full text-xs text-gray-600 font-medium"
                style={{ borderColor: `${store.themeColor}30` }}
              >
                {category}
              </span>
            ))}
            {store.categories.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-500 font-medium">
                +{store.categories.length - 4}
              </span>
            )}
          </div>
        </div>

        {featuredProducts.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Featured Products:</h4>
            <div className="grid grid-cols-2 gap-2">
              {featuredProducts.slice(0, 2).map((product) => (
                <div key={product.Id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs font-bold" style={{ color: store.themeColor }}>
                      ${product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {store.categories.length} categories
          </span>
          <div className="flex items-center gap-2 text-sm font-medium group-hover:text-primary-600 transition-colors duration-200">
            Browse Store
            <ApperIcon name="ArrowRight" className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StoreCard