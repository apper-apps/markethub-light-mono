import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order] = useState({
    Id: orderId,
    total: 159.97,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { productId: 1, quantity: 1, price: 999, name: "iPhone 15 Pro" },
      { productId: 2, quantity: 1, price: 8.99, name: "Organic Avocados" }
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="CheckCircle" className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Badge variant="success" className="text-base px-4 py-2">
            Order #{orderId}
          </Badge>
          <Badge variant="primary" className="text-base px-4 py-2">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium p-6"
        >
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
            Order Details
          </h2>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="gradient-text">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping & Delivery */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Shipping Address */}
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h3>
            <div className="text-gray-600">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ApperIcon name="Calendar" className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Estimated Delivery</p>
                  <p className="text-sm text-gray-600">{formatDate(order.estimatedDelivery)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="Truck" className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Standard Shipping</p>
                  <p className="text-sm text-gray-600">5-7 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="Package" className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Package Tracking</p>
                  <p className="text-sm text-gray-600">You'll receive an email with tracking info</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-12"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")} className="flex items-center gap-2">
            <ApperIcon name="ShoppingBag" className="w-5 h-5" />
            Continue Shopping
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <ApperIcon name="Mail" className="w-5 h-5" />
            Email Receipt
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 mt-6">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@markethub.com" className="text-primary-600 hover:underline">
            support@markethub.com
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default OrderConfirmation