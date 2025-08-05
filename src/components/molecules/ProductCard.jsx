import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { cartService } from "@/services/api/cartService"

const ProductCard = ({ product, className = "" }) => {
  const navigate = useNavigate()

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    try {
      await cartService.addToCart(product.Id, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error("Failed to add item to cart")
    }
  }

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`card-premium cursor-pointer group overflow-hidden ${className}`}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 10 && (
          <Badge 
            variant="warning" 
            className="absolute top-3 right-3 text-xs"
          >
            Low Stock
          </Badge>
        )}
        {product.rating >= 4.8 && (
          <Badge 
            variant="success" 
            className="absolute top-3 left-3 text-xs"
          >
            Best Seller
          </Badge>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-600 ml-1">
            ({product.rating})
          </span>
        </div>

        <h3 className="font-display font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">
              ${product.price}
            </span>
            {product.stock > 0 ? (
              <Badge variant="success" className="text-xs">
                In Stock
              </Badge>
            ) : (
              <Badge variant="error" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ShoppingCart" className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard