import productsData from "@/services/mockData/products.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getAll() {
    await delay(400)
    return [...productsData]
  },

  async getById(id) {
    await delay(200)
    const product = productsData.find(p => p.Id === parseInt(id))
    return product ? { ...product } : null
  },

  async getByStoreId(storeId) {
    await delay(350)
    return productsData.filter(p => p.storeId === parseInt(storeId)).map(p => ({ ...p }))
  },

  async searchProducts(query, storeId = null) {
    await delay(300)
    let products = [...productsData]
    
    if (storeId) {
      products = products.filter(p => p.storeId === parseInt(storeId))
    }
    
    if (query) {
      const lowerQuery = query.toLowerCase()
      products = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      )
    }
    
    return products
  },

  async getByCategory(category, storeId = null) {
    await delay(300)
    let products = [...productsData]
    
    if (storeId) {
      products = products.filter(p => p.storeId === parseInt(storeId))
    }
    
    return products.filter(p => p.category === category)
  },

  async getFeaturedProducts(limit = 4) {
    await delay(250)
    return productsData
      .filter(p => p.rating >= 4.5)
      .slice(0, limit)
      .map(p => ({ ...p }))
  }
}