import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/organisms/Header"
import ChatBot from "@/components/organisms/ChatBot"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Layout = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {children}
      </main>
      
      {/* Chat Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300"
            >
              <ApperIcon name="MessageCircle" className="w-6 h-6" />
            </Button>
            
            {/* Notification Dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white"
            />
            
            {/* Pulse Animation */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 opacity-30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ChatBot */}
      <AnimatePresence>
        <ChatBot 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      </AnimatePresence>
    </div>
  )
}

export default Layout