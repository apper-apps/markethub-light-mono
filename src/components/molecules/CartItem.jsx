import React from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cartService } from "@/services/api/cartService"

const CartItem = ({ item, product, onUpdate }) => {
  const handleQuantityChange = async (newQuantity) => {
    try {
      if (newQuantity < 1) {
        await cartService.removeFromCart(product.Id)
        toast.success("Item removed from cart")
      } else {
        await cartService.updateQuantity(product.Id, newQuantity)
        toast.success("Quantity updated")
      }
      onUpdate()
    } catch (error) {
      toast.error("Failed to update cart")
    }
  }

  const handleRemove = async () => {
    try {
      await cartService.removeFromCart(product.Id)
      toast.success("Item removed from cart")
      onUpdate()
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const subtotal = product.price * item.quantity

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card-premium p-4 mb-4"
    >
      <div className="flex gap-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">
                ${product.price} each
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-500 hover:bg-red-50 p-2"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 p-0 flex items-center justify-center"
              >
                <ApperIcon name="Minus" className="w-3 h-3" />
              </Button>
              
              <span className="font-semibold text-lg min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= product.stock}
                className="w-8 h-8 p-0 flex items-center justify-center"
              >
                <ApperIcon name="Plus" className="w-3 h-3" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold gradient-text">
                ${subtotal.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {product.stock} in stock
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem