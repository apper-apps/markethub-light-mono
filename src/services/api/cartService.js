const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// In-memory cart storage (would be replaced with database calls)
let cartItems = [];
let nextOrderId = 1;

export const cartService = {
  async getCart() {
    try {
      // For now, return in-memory cart items
      // In future, this would fetch from cart_item_c table
      return [...cartItems];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching cart:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async addToCart(productId, quantity = 1) {
    try {
      const existingItem = cartItems.find(item => item.productId === parseInt(productId));
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const newItem = {
          Id: cartItems.length + 1,
          productId: parseInt(productId),
          quantity: quantity,
          addedAt: new Date().toISOString()
        };
        cartItems.push(newItem);
        
        // In production, would create record in cart_item_c table:
        // const params = {
        //   records: [{
        //     Name: `Cart Item ${newItem.Id}`,
        //     product_id_c: parseInt(productId),
        //     quantity_c: quantity,
        //     added_at_c: new Date().toISOString()
        //   }]
        // };
        // const response = await apperClient.createRecord('cart_item_c', params);
      }
      
      return [...cartItems];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding to cart:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async updateQuantity(productId, quantity) {
    try {
      const item = cartItems.find(item => item.productId === parseInt(productId));
      
      if (item) {
        if (quantity <= 0) {
          cartItems = cartItems.filter(item => item.productId !== parseInt(productId));
        } else {
          item.quantity = quantity;
        }
        
        // In production, would update record in cart_item_c table:
        // const params = {
        //   records: [{
        //     Id: item.Id,
        //     quantity_c: quantity
        //   }]
        // };
        // const response = await apperClient.updateRecord('cart_item_c', params);
      }
      
      return [...cartItems];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating cart quantity:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async removeFromCart(productId) {
    try {
      cartItems = cartItems.filter(item => item.productId !== parseInt(productId));
      
      // In production, would delete record from cart_item_c table:
      // const response = await apperClient.deleteRecord('cart_item_c', {
      //   RecordIds: [cartItemId]
      // });
      
      return [...cartItems];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing from cart:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async clearCart() {
    try {
      cartItems = [];
      
      // In production, would delete all user's cart items from cart_item_c table
      
      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error clearing cart:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async createOrder(orderData) {
    try {
      const order = {
        Id: nextOrderId++,
        ...orderData,
        items: [...cartItems],
        status: "confirmed",
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      // Clear cart after order
      cartItems = [];
      
      // In production, would create order records and clear cart_item_c table
      
      return { ...order };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating order:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
throw error;
    }
  }
};