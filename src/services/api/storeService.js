const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const storeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "theme_color_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "categories_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('store_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform data to match UI expectations
      return response.data.map(store => ({
        Id: store.Id,
        name: store.Name,
        icon: store.icon_c || 'Store',
        themeColor: store.theme_color_c || '#3b82f6',
        description: store.description_c || '',
        categories: store.categories_c ? store.categories_c.split(',').map(cat => cat.trim()) : []
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching stores:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "theme_color_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "categories_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('store_c', parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const store = response.data;
      return {
        Id: store.Id,
        name: store.Name,
        icon: store.icon_c || 'Store',
        themeColor: store.theme_color_c || '#3b82f6',
        description: store.description_c || '',
        categories: store.categories_c ? store.categories_c.split(',').map(cat => cat.trim()) : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching store with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};