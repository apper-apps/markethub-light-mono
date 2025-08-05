import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { productService } from "@/services/api/productService"
import { storeService } from "@/services/api/storeService"
import { cartService } from "@/services/api/cartService"

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [store, setStore] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError("")
      
      const productData = await productService.getById(productId)
      
      if (!productData) {
        setError("Product not found")
        return
      }
      
      const storeData = await storeService.getById(productData.storeId)
      
      setProduct(productData)
      setStore(storeData)
    } catch (err) {
      setError("Failed to load product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(product.Id, quantity)
      toast.success(`${quantity} ${product.name} added to cart!`)
    } catch (error) {
      toast.error("Failed to add item to cart")
    }
  }

  const handleBuyNow = async () => {
    try {
      await cartService.addToCart(product.Id, quantity)
      navigate("/checkout")
    } catch (error) {
      toast.error("Failed to add item to cart")
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        className={`w-5 h-5 ${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="w-full h-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse" />
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          title="Product not found"
          message={error || "The product you're looking for doesn't exist or has been removed."}
          onRetry={loadProduct}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm text-gray-600 mb-8"
      >
        <button onClick={() => navigate("/")} className="hover:text-primary-600">
          Home
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        {store && (
          <>
            <button 
              onClick={() => navigate(`/store/${store.Id}`)} 
              className="hover:text-primary-600"
            >
              {store.name}
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </>
        )}
        <span className="text-gray-900 font-medium">{product.name}</span>
      </motion.nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="relative overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            {product.stock < 10 && product.stock > 0 && (
              <Badge 
                variant="warning" 
                className="absolute top-4 right-4"
              >
                Only {product.stock} left
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge 
                variant="error" 
                className="absolute top-4 right-4"
              >
                Out of Stock
              </Badge>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? "border-primary-500 shadow-lg" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Store Badge */}
          {store && (
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${store.themeColor}20` }}
              >
                <ApperIcon 
                  name={store.icon} 
                  className="w-4 h-4"
                  style={{ color: store.themeColor }}
                />
              </div>
              <button 
                onClick={() => navigate(`/store/${store.Id}`)}
                className="text-sm font-medium hover:underline"
                style={{ color: store.themeColor }}
              >
                {store.name} Store
              </button>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {product.rating}
            </span>
            <span className="text-gray-600">
              (124 reviews)
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold gradient-text">
              ${product.price}
            </span>
            {product.stock > 0 ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="error">Out of Stock</Badge>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="card-premium p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium text-gray-900">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 p-0 flex items-center justify-center"
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </Button>
                <span className="font-semibold text-xl min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 p-0 flex items-center justify-center"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                {product.stock} available
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ApperIcon name="ShoppingCart" className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ApperIcon name="Zap" className="w-5 h-5" />
                Buy Now
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <ApperIcon name="Truck" className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-sm">Free Shipping</div>
                <div className="text-xs text-gray-600">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ApperIcon name="RotateCcw" className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Easy Returns</div>
                <div className="text-xs text-gray-600">30-day return policy</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ApperIcon name="Shield" className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm">Warranty</div>
                <div className="text-xs text-gray-600">1-year manufacturer</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetail