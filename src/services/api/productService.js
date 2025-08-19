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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
      }
      return [];
    }
  },

  // Transform database product to UI format
  transformProduct(product) {

    let productImages = [];
    if (product.images_c) {
      try {
        productImages = JSON.parse(product.images_c);
      } catch (error) {
        // If parsing fails, treat as array of string
        productImages = [product.images_c];
      }
    }

    let productSpecifications = {};
    if (product.specifications_c) {
      try {
        productSpecifications = JSON.parse(product.specifications_c);
      } catch (error) {
        // If parsing fails, treat as array of string
        productSpecifications = product.specifications_c;
      }
    }

    return {
      id: product.Id,
      Id: product.Id,
      name: product.Name,
      price: product.price_c,
      description: product.description_c,
      images: productImages,
      category: product.category_c,
      stock: product.stock_c,
      rating: product.rating_c,
      specifications: productSpecifications,
      storeId: product.store_id_c?.Id || product.store_id_c
    };
  }
};

export default productService;