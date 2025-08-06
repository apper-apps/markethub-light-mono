// Chat service for managing chatbot interactions
class ChatService {
  constructor() {
    this.conversations = new Map()
    this.currentSessionId = null
  }

  // Initialize a new chat session
  startSession() {
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.currentSessionId = sessionId
    this.conversations.set(sessionId, {
      id: sessionId,
      messages: [],
      startTime: new Date(),
      lastActivity: new Date()
    })
    return sessionId
  }

  // Get current session or create new one
  getCurrentSession() {
    if (!this.currentSessionId || !this.conversations.has(this.currentSessionId)) {
      return this.startSession()
    }
    return this.currentSessionId
  }

  // Add message to current session
  addMessage(message) {
    const sessionId = this.getCurrentSession()
    const conversation = this.conversations.get(sessionId)
    
    if (conversation) {
      conversation.messages.push({
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date()
      })
      conversation.lastActivity = new Date()
    }
    
    return message
  }

  // Get conversation history
  getConversation(sessionId = null) {
    const targetSessionId = sessionId || this.getCurrentSession()
    return this.conversations.get(targetSessionId) || null
  }

  // Generate bot response based on user input
  async generateResponse(userMessage, context = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    const message = userMessage.toLowerCase().trim()
    const { currentStore, cartCount = 0, userHistory = [] } = context

    // Greeting responses
    if (this.isGreeting(message)) {
      return this.getGreetingResponse()
    }

    // Store-specific queries
    if (message.includes('store') || message.includes('shop')) {
      return this.getStoreResponse(message, currentStore)
    }

    // Product search queries
    if (message.includes('product') || message.includes('find') || message.includes('search')) {
      return this.getProductResponse(message)
    }

    // Cart and checkout queries
    if (message.includes('cart') || message.includes('checkout') || message.includes('buy')) {
      return this.getCartResponse(message, cartCount)
    }

    // Order and delivery queries
    if (message.includes('order') || message.includes('delivery') || message.includes('shipping')) {
      return this.getOrderResponse(message)
    }

    // Help and support
    if (message.includes('help') || message.includes('support') || message.includes('problem')) {
      return this.getHelpResponse(message)
    }

    // Recommendations
    if (message.includes('recommend') || message.includes('suggest') || message.includes('best')) {
      return this.getRecommendationResponse(message)
    }

    // Category-specific responses
    if (message.includes('electronics') || message.includes('phone') || message.includes('laptop')) {
      return this.getElectronicsResponse(message)
    }

    if (message.includes('fashion') || message.includes('clothes') || message.includes('wear')) {
      return this.getFashionResponse(message)
    }

    if (message.includes('home') || message.includes('furniture') || message.includes('decor')) {
      return this.getHomeResponse(message)
    }

    if (message.includes('book') || message.includes('read')) {
      return this.getBooksResponse(message)
    }

    if (message.includes('sports') || message.includes('fitness') || message.includes('exercise')) {
      return this.getSportsResponse(message)
    }

    // Price and deals
    if (message.includes('price') || message.includes('cost') || message.includes('cheap') || message.includes('deal')) {
      return this.getPricingResponse(message)
    }

    // Default fallback
    return this.getDefaultResponse()
  }

  // Helper methods for different response types
  isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
    return greetings.some(greeting => message.includes(greeting))
  }

  getGreetingResponse() {
    const responses = [
      "Hello! Welcome to MarketHub! I'm here to help you find exactly what you're looking for. How can I assist you today?",
      "Hi there! I'm your personal shopping assistant. Whether you need product recommendations, store information, or help with your cart, I'm here to help!",
      "Hey! Great to see you at MarketHub. I can help you discover amazing products, compare prices, and make your shopping experience seamless. What interests you today?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  getStoreResponse(message, currentStore) {
    if (currentStore) {
      return `You're currently browsing ${currentStore.name}! This store specializes in ${currentStore.categories.join(', ')}. I can help you find specific products here or guide you to other stores. What are you looking for?`
    }

    return `MarketHub has 5 fantastic stores:\n\n🔌 **Electronics** - Latest gadgets, phones, laptops\n👗 **Fashion** - Trendy clothing and accessories\n🏠 **Home & Garden** - Furniture and home decor\n📚 **Books** - Wide selection of books and e-books\n⚽ **Sports** - Fitness equipment and sportswear\n\nWhich store would you like to explore?`
  }

  getProductResponse(message) {
    return `I can help you find the perfect product! Here are some tips:\n\n🔍 **Use the search bar** at the top to find specific items\n🏷️ **Browse by category** in each store\n⭐ **Check product ratings** and reviews\n💰 **Compare prices** across different options\n\nWhat specific product are you looking for? I can point you in the right direction!`
  }

  getCartResponse(message, cartCount) {
    if (cartCount > 0) {
      return `You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart! You can:\n\n✅ **Review items** by clicking the cart icon\n✏️ **Update quantities** as needed\n🛒 **Continue shopping** for more items\n💳 **Proceed to checkout** when ready\n\nNeed help with anything specific about your cart?`
    }

    return `Your cart is currently empty, but that's easy to fix! Here's how to add items:\n\n1️⃣ Browse products in any store\n2️⃣ Click "Add to Cart" on items you like\n3️⃣ Adjust quantities if needed\n4️⃣ Checkout when you're ready\n\nWant me to recommend some popular products to get started?`
  }

  getOrderResponse(message) {
    return `Here's what you need to know about orders:\n\n📦 **Order Processing**: 24-48 hours\n🚚 **Standard Delivery**: 3-5 business days\n⚡ **Express Delivery**: 1-2 business days\n📧 **Tracking**: Email confirmation with tracking number\n🔄 **Returns**: 30-day return policy\n\nDo you have a specific order you'd like me to help you track?`
  }

  getHelpResponse(message) {
    return `I'm here to help with everything MarketHub! I can assist you with:\n\n🏪 **Store Navigation** - Find the right store for your needs\n🔍 **Product Search** - Locate specific items quickly\n🛒 **Cart Management** - Add, remove, or update items\n💳 **Checkout Process** - Complete your purchase smoothly\n📦 **Order Tracking** - Check your order status\n💰 **Deals & Discounts** - Find the best prices\n\nWhat specific area would you like help with?`
  }

  getRecommendationResponse(message) {
    const recommendations = [
      "Based on what's popular, I'd recommend checking out:\n\n📱 **Smartphones** in Electronics\n👟 **Sneakers** in Fashion\n🪴 **Indoor Plants** in Home & Garden\n📖 **Bestselling Novels** in Books\n🏋️ **Fitness Equipment** in Sports",
      
      "Here are some trending items across our stores:\n\n💻 **Laptops** - Great for work and gaming\n👗 **Summer Dresses** - Perfect for the season\n🛋️ **Comfortable Chairs** - Upgrade your home office\n📚 **Self-Help Books** - Popular personal development titles\n⚽ **Yoga Mats** - For your fitness journey"
    ]
    
    return recommendations[Math.floor(Math.random() * recommendations.length)]
  }

  getElectronicsResponse(message) {
    return `Our Electronics store is amazing! Popular categories include:\n\n📱 **Smartphones** - Latest models from top brands\n💻 **Laptops** - For work, gaming, and creativity\n🎧 **Audio** - Headphones, speakers, earbuds\n📺 **Smart Home** - TVs, smart speakers, security\n⌚ **Wearables** - Smartwatches and fitness trackers\n\nLooking for anything specific in electronics?`
  }

  getFashionResponse(message) {
    return `Fashion is all about expressing yourself! We have:\n\n👔 **Men's Fashion** - Shirts, pants, suits, casual wear\n👗 **Women's Fashion** - Dresses, tops, bottoms, formal wear\n👟 **Footwear** - Sneakers, boots, sandals, dress shoes\n👜 **Accessories** - Bags, jewelry, watches, belts\n🧥 **Seasonal Items** - Jackets, swimwear, winter gear\n\nWhat style are you going for today?`
  }

  getHomeResponse(message) {
    return `Transform your space with our Home & Garden collection:\n\n🛋️ **Living Room** - Sofas, tables, entertainment centers\n🛏️ **Bedroom** - Beds, dressers, nightstands\n🍽️ **Dining** - Tables, chairs, dinnerware\n🌿 **Garden** - Plants, tools, outdoor furniture\n🎨 **Decor** - Wall art, lamps, rugs, curtains\n\nWhich room are you looking to upgrade?`
  }

  getBooksResponse(message) {
    return `Discover your next great read in our Books store:\n\n📚 **Fiction** - Novels, sci-fi, mystery, romance\n📖 **Non-Fiction** - History, biography, self-help\n👶 **Children's Books** - Picture books, young adult\n🎓 **Educational** - Textbooks, reference materials\n📱 **E-Books** - Digital versions for instant reading\n\nWhat genre interests you most?`
  }

  getSportsResponse(message) {
    return `Get active with our Sports collection:\n\n🏋️ **Fitness Equipment** - Weights, machines, yoga gear\n👟 **Athletic Footwear** - Running shoes, training sneakers\n👕 **Sportswear** - Activewear, team jerseys\n⚽ **Sports Gear** - Balls, equipment for various sports\n🏃 **Outdoor Activities** - Camping, hiking, cycling gear\n\nWhat sport or activity are you interested in?`
  }

  getPricingResponse(message) {
    return `I can help you find great deals! Here are some money-saving tips:\n\n💰 **Compare Prices** - Check similar products across stores\n🏷️ **Look for Sales** - Many items have special pricing\n📦 **Bundle Deals** - Save when buying multiple items\n⭐ **Customer Reviews** - Ensure you're getting quality\n🔔 **Wishlist Items** - Save favorites and watch for price drops\n\nWhat's your budget range for what you're looking for?`
  }

  getDefaultResponse() {
    const responses = [
      "That's an interesting question! Could you tell me more about what you're looking for? I'm here to help make your shopping experience great.",
      
      "I'd love to help you with that! Can you provide a bit more detail about what you need? Whether it's finding products, comparing prices, or navigating the stores, I'm here to assist.",
      
      "Thanks for reaching out! I want to make sure I give you the most helpful response. Could you clarify what you're looking for or what specific help you need today?",
      
      "I'm here to make your MarketHub experience amazing! While I didn't catch exactly what you need, I can help with product searches, store recommendations, cart assistance, and much more. What would be most helpful?",
      
      "Great question! I'm your personal shopping assistant and I'd love to help you find exactly what you need. Could you tell me more about what you're interested in or what kind of help you're looking for?"
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Clear conversation history
  clearConversation(sessionId = null) {
    const targetSessionId = sessionId || this.currentSessionId
    if (this.conversations.has(targetSessionId)) {
      this.conversations.delete(targetSessionId)
    }
    if (targetSessionId === this.currentSessionId) {
      this.currentSessionId = null
    }
  }

  // Get all active conversations
  getAllConversations() {
    return Array.from(this.conversations.values())
  }
}

// Export singleton instance
export const chatService = new ChatService()
export default chatService