import storesData from "@/services/mockData/stores.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const storeService = {
  async getAll() {
    await delay(300)
    return [...storesData]
  },

  async getById(id) {
    await delay(200)
    const store = storesData.find(s => s.Id === parseInt(id))
    return store ? { ...store } : null
  }
}