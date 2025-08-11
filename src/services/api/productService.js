const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const productService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "store_id_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
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
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "store_id_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('product_c', parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return this.transformProduct(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByStoreId(storeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "store_id_c" } }
        ],
        where: [
          {
            FieldName: "store_id_c",
            Operator: "EqualTo",
            Values: [parseInt(storeId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by store ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async searchProducts(query, storeId = null) {
    try {
      const whereConditions = [];
      
      if (query) {
        whereConditions.push({
          FieldName: "Name",
          Operator: "Contains",
          Values: [query]
        });
      }
      
      if (storeId) {
        whereConditions.push({
          FieldName: "store_id_c",
          Operator: "EqualTo",
          Values: [parseInt(storeId)]
        });
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "store_id_c" } }
        ],
        where: whereConditions
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByCategory(category, storeId = null) {
    try {
      const whereConditions = [
        {
          FieldName: "category_c",
          Operator: "EqualTo",
          Values: [category]
        }
      ];
      
      if (storeId) {
        whereConditions.push({
          FieldName: "store_id_c",
          Operator: "EqualTo",
          Values: [parseInt(storeId)]
        });
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "store_id_c" } }
        ],
        where: whereConditions
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getFeaturedProducts(limit = 4) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "store_id_c" } }
        ],
        where: [
          {
            FieldName: "rating_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [4.5]
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(product => this.transformProduct(product));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

transformProduct(product) {
    return {
      Id: product.Id,
      name: product.Name,
      price: product.price_c || 0,
      description: product.description_c || '',
      images: product.images_c ? product.images_c.split(',').map(img => img.trim()) : [],
      category: product.category_c || '',
      stock: product.stock_c || 0,
      rating: product.rating_c || 0,
      specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {},
      storeId: product.store_id_c?.Id || product.store_id_c || null
    };
  }
};