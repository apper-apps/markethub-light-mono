import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { cartService } from "@/services/api/cartService"
import { productService } from "@/services/api/productService"

const Checkout = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form state
  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  })
  
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    paymentMethod: "card"
  })

  useEffect(() => {
    loadCheckoutData()
  }, [])

  const loadCheckoutData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const cart = await cartService.getCart()
      if (cart.length === 0) {
        navigate("/cart")
        return
      }
      
      setCartItems(cart)
      
      // Load product details
      const productPromises = cart.map(item => productService.getById(item.productId))
      const productData = await Promise.all(productPromises)
      
      const productsMap = {}
      productData.forEach(product => {
        if (product) {
          productsMap[product.Id] = product
        }
      })
      
      setProducts(productsMap)
    } catch (err) {
      setError("Failed to load checkout data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const product = products[item.productId]
      return product ? total + (product.price * item.quantity) : total
    }, 0)
    
    const tax = subtotal * 0.08
    const shipping = subtotal >= 50 ? 0 : 9.99
    const total = subtotal + tax + shipping
    
    return { subtotal, tax, shipping, total }
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    const required = ["firstName", "lastName", "email", "address", "city", "state", "zipCode"]
    const missing = required.filter(field => !shippingForm[field].trim())
    
    if (missing.length > 0) {
      toast.error("Please fill in all required fields")
      return
    }
    
    setCurrentStep(2)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardName) {
      toast.error("Please fill in all payment details")
      return
    }
    
    try {
      setSubmitting(true)
      
      const { total } = calculateTotals()
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: products[item.productId]?.price || 0
        })),
        total: total,
        shippingAddress: shippingForm,
        paymentMethod: paymentForm.paymentMethod,
        status: "confirmed"
      }
      
      const order = await cartService.createOrder(orderData)
      
      toast.success("Order placed successfully!")
      navigate(`/order-confirmation/${order.Id}`)
    } catch (err) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          title="Checkout Error"
          message={error}
          onRetry={loadCheckoutData}
        />
      </div>
    )
  }

  const { subtotal, tax, shipping, total } = calculateTotals()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          Checkout
        </h1>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-primary-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-primary-600 text-white" : "bg-gray-200"
            }`}>
              {currentStep > 1 ? <ApperIcon name="Check" className="w-4 h-4" /> : "1"}
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className={`w-8 h-0.5 ${currentStep >= 2 ? "bg-primary-600" : "bg-gray-200"}`} />
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-primary-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-primary-600 text-white" : "bg-gray-200"
            }`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-premium p-6"
            >
              <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
                Shipping Information
              </h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      value={shippingForm.firstName}
                      onChange={(e) => setShippingForm({...shippingForm, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      value={shippingForm.lastName}
                      onChange={(e) => setShippingForm({...shippingForm, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({...shippingForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({...shippingForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <Input
                    type="text"
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({...shippingForm, address: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <Input
                      type="text"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <Input
                      type="text"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({...shippingForm, state: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <Input
                      type="text"
                      value={shippingForm.zipCode}
                      onChange={(e) => setShippingForm({...shippingForm, zipCode: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Shipping Summary */}
              <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Shipping Address
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-gray-600">
                  <p>{shippingForm.firstName} {shippingForm.lastName}</p>
                  <p>{shippingForm.address}</p>
                  <p>{shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}</p>
                  <p>{shippingForm.email}</p>
                </div>
              </div>

              {/* Payment Form */}
              <div className="card-premium p-6">
                <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentForm.expiryDate}
                        onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card *
                    </label>
                    <Input
                      type="text"
                      value={paymentForm.cardName}
                      onChange={(e) => setPaymentForm({...paymentForm, cardName: e.target.value})}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitting}
                  >
                    {submitting ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
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
              {cartItems.map(item => {
                const product = products[item.productId]
                if (!product) return null
                
                return (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${product.price}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                <span>Total</span>
                <span className="gradient-text">${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout