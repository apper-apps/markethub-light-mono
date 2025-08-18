import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import StoreCard from "@/components/molecules/StoreCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { storeService } from "@/services/api/storeService"
import { productService } from "@/services/api/productService"

const StoreDashboard = () => {
  const [stores, setStores] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [storesData, allFeaturedProducts] = await Promise.all([
        storeService.getAll(),
        productService.getFeaturedProducts(20)
      ])
      
      setStores(storesData)
      
      // Group featured products by store
const productsByStore = {}
      allFeaturedProducts.forEach(product => {
        if (!productsByStore[product.store_c]) {
          productsByStore[product.store_c] = []
        }
        if (productsByStore[product.store_c].length < 2) {
          productsByStore[product.store_c].push(product)
        }
      })
      
      setFeaturedProducts(productsByStore)
    } catch (err) {
      setError("Failed to load stores. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-64 mx-auto animate-pulse mb-4" />
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-96 mx-auto animate-pulse" />
        </div>
        <Loading type="stores" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          title="Failed to load stores"
          message={error}
          onRetry={loadData}
        />
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="Store"
          title="No stores available"
          message="We're working on adding stores to our marketplace. Check back soon for exciting shopping options!"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
          Welcome to MarketHub
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Your one-stop destination for shopping across multiple categories. 
          Discover electronics, groceries, toys, stationery, and furniture all in one place.
        </p>
      </motion.div>

      {/* Store Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        <div className="card-premium p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">{stores.length}</div>
          <div className="text-sm text-gray-600">Stores</div>
        </div>
        <div className="card-premium p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">
            {stores.reduce((total, store) => total + store.categories.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="card-premium p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">1000+</div>
          <div className="text-sm text-gray-600">Products</div>
        </div>
        <div className="card-premium p-6 text-center">
          <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
      </motion.div>

      {/* Stores Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-8 text-center">
          Browse Our Stores
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <motion.div
              key={store.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <StoreCard 
                store={store} 
                featuredProducts={featuredProducts[store.Id] || []}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center py-12"
      >
        <div className="card-premium p-8 max-w-2xl mx-auto bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100">
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Start Shopping Today
          </h3>
          <p className="text-gray-600 mb-6">
            Explore thousands of products across all our stores with fast delivery and secure checkout.
</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => window.location.href = '/add-store'}
                className="btn-primary inline-flex items-center gap-2"
              >
                🏪 Add New Store
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="btn-secondary inline-flex items-center gap-2">
                📱 Download App
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default StoreDashboard