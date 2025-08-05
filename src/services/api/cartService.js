let cartItems = []
let nextOrderId = 1

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const cartService = {
  async getCart() {
    await delay(200)
    return [...cartItems]
  },

  async addToCart(productId, quantity = 1) {
    await delay(300)
    const existingItem = cartItems.find(item => item.productId === parseInt(productId))
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const newItem = {
        Id: cartItems.length + 1,
        productId: parseInt(productId),
        quantity: quantity,
        addedAt: new Date().toISOString()
      }
      cartItems.push(newItem)
    }
    
    return [...cartItems]
  },

  async updateQuantity(productId, quantity) {
    await delay(250)
    const item = cartItems.find(item => item.productId === parseInt(productId))
    
    if (item) {
      if (quantity <= 0) {
        cartItems = cartItems.filter(item => item.productId !== parseInt(productId))
      } else {
        item.quantity = quantity
      }
    }
    
    return [...cartItems]
  },

  async removeFromCart(productId) {
    await delay(200)
    cartItems = cartItems.filter(item => item.productId !== parseInt(productId))
    return [...cartItems]
  },

  async clearCart() {
    await delay(150)
    cartItems = []
    return []
  },

  async createOrder(orderData) {
    await delay(500)
    const order = {
      Id: nextOrderId++,
      ...orderData,
      items: [...cartItems],
      status: "confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    // Clear cart after order
    cartItems = []
    
    return { ...order }
  }
}