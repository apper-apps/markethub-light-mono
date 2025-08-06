import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your MarketHub shopping assistant. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('store') || message.includes('shop')) {
      return "I can help you find stores! We have Electronics, Fashion, Home & Garden, Books, and Sports stores. Which category interests you?"
    }
    
    if (message.includes('product') || message.includes('search')) {
      return "You can search for products using the search bar at the top. I can also help you find specific items - just tell me what you're looking for!"
    }
    
    if (message.includes('cart') || message.includes('checkout')) {
      return "Your cart is always available in the top-right corner. You can add items, update quantities, and proceed to checkout anytime. Need help with a specific cart issue?"
    }
    
    if (message.includes('order') || message.includes('delivery')) {
      return "After checkout, you'll receive an order confirmation with tracking details. Orders typically process within 24 hours. Is there a specific order you need help with?"
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! I can assist with:\n• Finding stores and products\n• Cart and checkout questions\n• Order status and delivery\n• Account and payment issues\n\nWhat do you need help with?"
    }
    
    if (message.includes('recommend') || message.includes('suggest')) {
      return "I'd love to recommend products! What are you interested in? For example, I can suggest electronics, fashion items, home products, books, or sports equipment."
    }
    
    if (message.includes('electronics')) {
      return "Great choice! Our Electronics store has smartphones, laptops, headphones, and smart home devices. Popular items include the latest phones and wireless earbuds. What type of electronics are you looking for?"
    }
    
    if (message.includes('fashion') || message.includes('clothes')) {
      return "Our Fashion store has trendy clothing, shoes, and accessories for all styles. We have casual wear, formal attire, and seasonal collections. Are you shopping for a specific occasion?"
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('cheap')) {
      return "I can help you find great deals! Use the filters on product pages to sort by price, or browse our featured products for current promotions. Looking for anything specific within a budget?"
    }
    
    // Default responses
    const defaultResponses = [
      "That's interesting! Can you tell me more about what you're looking for?",
      "I'd be happy to help with that. Could you provide more details?",
      "Let me help you with that. What specific information do you need?",
      "Thanks for asking! How can I assist you with your shopping today?",
      "I'm here to make your shopping easier. What would you like to know?"
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: getBotResponse(userMessage.content),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // 1-2 seconds delay
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: "Chat cleared! How can I help you today?",
      timestamp: new Date()
    }])
    toast.success('Chat history cleared')
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-xl shadow-premium border border-gray-200 flex flex-col z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <ApperIcon name="MessageCircle" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Shopping Assistant</h3>
            <p className="text-xs opacity-90">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={clearChat}
            className="text-white hover:bg-white/20 p-2"
            title="Clear chat"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2"
            title="Close chat"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 opacity-70 ${
                message.type === 'user' ? 'text-white' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">Assistant is typing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '80px' }}
              disabled={isTyping}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg"
          >
            <ApperIcon name="Send" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatBot