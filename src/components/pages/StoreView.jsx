import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import ProductGrid from "@/components/organisms/ProductGrid"
import CategorySidebar from "@/components/organisms/CategorySidebar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { storeService } from "@/services/api/storeService"

const StoreView = () => {
  const { storeId } = useParams()
  const [store, setStore] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    loadStore()
  }, [storeId])

  const loadStore = async () => {
    try {
      setLoading(true)
      setError("")
      
const storeData = await storeService.getById(storeId)
      if (!storeData) {
        setError("Store not found")
        return
      }
      
      setStore(storeData)
    } catch (err) {
      setError("Failed to load store. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64">
            <div className="space-y-4">
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-8">
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-64 animate-pulse mb-2" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-96 animate-pulse" />
            </div>
            <Loading type="products" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          title="Store not found"
          message={error || "The store you're looking for doesn't exist or has been removed."}
          onRetry={loadStore}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Store Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-6 mb-6">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
style={{ backgroundColor: `${store.themeColor}20` }}
          >
            <ApperIcon 
              name={store.icon} 
              className="w-10 h-10"
              style={{ color: store.themeColor }}
            />
          </div>
          <div className="flex-1">
<h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
              {store.name} Store
            </h1>
<p className="text-lg text-gray-600 mb-4">
              {store.description}
            </p>
            <div className="flex flex-wrap gap-2">
{store.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white border rounded-full text-sm text-gray-600 font-medium shadow-sm"
                  style={{ borderColor: `${store.themeColor}30` }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="card-premium p-4 sticky top-24">
            <CategorySidebar
categories={store.categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              storeColor={store.themeColor}
            />
          </div>
        </div>

        {/* Mobile Category Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-14 h-14 rounded-full shadow-premium flex items-center justify-center text-white"
style={{ backgroundColor: store.themeColor }}
          >
            <ApperIcon name="Filter" className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-40 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-bold">Categories</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
                <CategorySidebar
categories={store.categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={(category) => {
                    setSelectedCategory(category)
                    setSidebarOpen(false)
                  }}
                  storeColor={store.themeColor}
                />
              </div>
            </motion.div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProductGrid 
storeId={parseInt(storeId)}
              category={selectedCategory}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StoreView