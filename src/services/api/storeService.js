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
  },

  async create(storeData) {
    try {
      const params = {
        records: [
          {
            // Only include Updateable fields as per field visibility rules
            Name: storeData.name,
            Tags: storeData.tags || '',
            icon_c: storeData.icon || 'Store',
            theme_color_c: storeData.themeColor || '#3b82f6',
            description_c: storeData.description || '',
            categories_c: Array.isArray(storeData.categories) ? storeData.categories.join(', ') : storeData.categories || ''
          }
        ]
      };

      const response = await apperClient.createRecord('store_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} store records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating store:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        throw error;
      }
    }
  },

  async update(id, storeData) {
    try {
      const params = {
        records: [
          {
            // Include ID and only Updateable fields
            Id: parseInt(id),
            Name: storeData.name,
            Tags: storeData.tags || '',
            icon_c: storeData.icon || 'Store',
            theme_color_c: storeData.themeColor || '#3b82f6',
            description_c: storeData.description || '',
            categories_c: Array.isArray(storeData.categories) ? storeData.categories.join(', ') : storeData.categories || ''
          }
        ]
      };

      const response = await apperClient.updateRecord('store_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} store records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating store:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('store_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} store records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting store:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        throw error;
      }
    }
  }
};