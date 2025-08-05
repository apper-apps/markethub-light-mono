import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import ProductCard from "@/components/molecules/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { productService } from "@/services/api/productService"

const ProductGrid = ({ storeId = null, category = null }) => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    loadProducts()
  }, [storeId, category, searchParams])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      
      const searchQuery = searchParams.get("q")
      let data = []

      if (searchQuery) {
        data = await productService.searchProducts(searchQuery, storeId)
      } else if (category) {
        data = await productService.getByCategory(category, storeId)
      } else if (storeId) {
        data = await productService.getByStoreId(storeId)
      } else {
        data = await productService.getAll()
      }

      setProducts(data)
    } catch (err) {
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
      default:
        return a.name.localeCompare(b.name)
    }
  })

  if (loading) {
    return <Loading type="products" />
  }

  if (error) {
    return (
      <Error 
        title="Failed to load products"
        message={error}
        onRetry={loadProducts}
      />
    )
  }

  if (products.length === 0) {
    const searchQuery = searchParams.get("q")
    return (
      <Empty
        icon="Search"
        title={searchQuery ? "No search results" : "No products found"}
        message={
          searchQuery 
            ? `We couldn't find any products matching "${searchQuery}". Try different keywords or browse our categories.`
            : "This store doesn't have any products yet. Check back later for new arrivals!"
        }
        actionText="Browse All Products"
        actionPath="/"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="p-2"
            >
              <ApperIcon name="Grid3X3" className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="p-2"
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field py-2 px-3 text-sm"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="rating">Rating (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Products Grid/List */}
      <motion.div
        layout
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {sortedProducts.map((product, index) => (
          <motion.div
            key={product.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={viewMode === "list" ? "max-w-4xl" : ""}
          >
            <ProductCard 
              product={product} 
              className={viewMode === "list" ? "flex-row" : ""}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default ProductGrid