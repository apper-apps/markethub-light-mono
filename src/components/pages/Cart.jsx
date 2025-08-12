import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import CartItem from "@/components/molecules/CartItem"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { cartService } from "@/services/api/cartService"
import { productService } from "@/services/api/productService"
import { storeService } from "@/services/api/storeService"

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState({})
  const [stores, setStores] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      setError("")
      
const cart = await cartService.getCart()
      setCartItems(cart)
      
      if (cart.length > 0) {
        // Load product details for each cart item
const productPromises = cart.map(item => productService.getById(item.productId))
        const productData = await Promise.all(productPromises)
        
        const productsMap = {}
        const storeIds = new Set()
        
        productData.forEach(product => {
          if (product) {
productsMap[product.id] = product
            storeIds.add(product.storeId)
          }
        })
        
        setProducts(productsMap)
        
        // Load store details
        const storePromises = Array.from(storeIds).map(storeId => 
storeService.getById(storeId)
        )
        const storeData = await Promise.all(storePromises)
        
        const storesMap = {}
        storeData.forEach(store => {
          if (store) {
storesMap[store.Id] = store
          }
        })
        
        setStores(storesMap)
      }
    } catch (err) {
      setError("Failed to load cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
const product = products[item.productId]
      return product ? total + (product.price * item.quantity) : total
    }, 0)
  }

  const calculateTax = (subtotal) => {
    return subtotal * 0.08 // 8% tax
  }

  const calculateShipping = (subtotal) => {
    return subtotal >= 50 ? 0 : 9.99
  }

  const groupItemsByStore = () => {
    const groups = {}
    cartItems.forEach(item => {
const product = products[item.productId]
      if (product) {
        const storeId = product.storeId
        if (!groups[storeId]) {
          groups[storeId] = []
        }
        groups[storeId].push({ item, product })
      }
    })
    return groups
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-48 animate-pulse mb-8" />
        <Loading type="cart" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          title="Failed to load cart"
          message={error}
          onRetry={loadCart}
        />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="ShoppingCart"
          title="Your cart is empty"
          message="Start shopping to add items to your cart. Browse our stores to find products you love!"
          actionText="Browse Stores"
          actionPath="/"
        />
      </div>
    )
  }

  const subtotal = calculateTotal()
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  const total = subtotal + tax + shipping
  const groupedItems = groupItemsByStore()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-600">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <AnimatePresence>
{Object.entries(groupedItems).map(([storeId, storeItems]) => {
              const store = stores[parseInt(storeId)]
              return (
                <motion.div
                  key={storeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  {/* Store Header */}
                  {store && (
                    <div 
className="flex items-center gap-3 p-4 rounded-lg mb-4"
                      style={{ backgroundColor: `${store.themeColor}10` }}
                    >
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
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {store.name} Store
                        </h3>
                        <p className="text-sm text-gray-600">
                          {storeItems.length} item{storeItems.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Store Items */}
                  <div className="space-y-4">
                    {storeItems.map(({ item, product }) => (
<CartItem
                        key={item.productId}
                        item={item}
                        product={product}
                        onUpdate={loadCart}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-premium p-6 sticky top-24"
          >
            <h3 className="text-xl font-display font-bold text-gray-900 mb-6">
              Order Summary
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {shipping > 0 && (
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="gradient-text">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2"
              >
                <ApperIcon name="CreditCard" className="w-5 h-5" />
                Proceed to Checkout
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                Continue Shopping
              </Button>
            </div>

            {/* Security Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <ApperIcon name="Shield" className="w-4 h-4 text-green-600" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Truck" className="w-4 h-4 text-blue-600" />
                <span>Fast & reliable delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart