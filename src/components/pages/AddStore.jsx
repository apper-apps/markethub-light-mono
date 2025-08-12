import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { storeService } from '@/services/api/storeService';

const AddStore = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Store',
    themeColor: '#3b82f6',
    categories: '',
    tags: ''
  });

  const iconOptions = [
    'Store', 'ShoppingBag', 'Package', 'Gift', 'Home', 'Smartphone',
    'Laptop', 'GameController', 'Book', 'Car', 'Coffee', 'Pizza',
    'Shirt', 'Watch', 'Camera', 'Headphones', 'Heart', 'Star'
  ];

  const colorOptions = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#6366f1'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Store name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Store description is required');
      return;
    }

    setLoading(true);
    try {
      // Transform categories string to array
      const storeData = {
        ...formData,
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat)
      };

      await storeService.create(storeData);
      toast.success('Store created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Store" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Add New Store
            </h1>
            <p className="text-gray-600">
              Create a new store to start selling your products
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Store Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter store name"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your store and what you sell"
                className="input-field resize-none"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Icon
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-3">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.icon === icon
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ApperIcon name={icon} className="w-5 h-5 mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, themeColor: color }))}
                    className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                      formData.themeColor === color
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <Input
                id="categories"
                name="categories"
                type="text"
                value={formData.categories}
                onChange={handleInputChange}
                placeholder="Electronics, Fashion, Home (comma separated)"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter categories separated by commas
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="trending, new, popular"
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex-1"
              >
                Create Store
              </Button>
            </div>
          </form>

          {/* Preview */}
          {formData.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-gray-50 rounded-lg"
            >
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${formData.themeColor}20` }}
                >
                  <ApperIcon 
                    name={formData.icon} 
                    className="w-6 h-6"
                    style={{ color: formData.themeColor }}
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{formData.name}</div>
                  <div className="text-sm text-gray-500">
                    {formData.categories ? formData.categories.split(',').length : 0} categories
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AddStore;