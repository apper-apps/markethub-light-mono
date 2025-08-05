import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import { cartService } from "@/services/api/cartService"
import { storeService } from "@/services/api/storeService"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)
  const [stores, setStores] = useState([])
  const [currentStore, setCurrentStore] = useState(null)
  const [showStoreDropdown, setShowStoreDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadCartCount()
    loadStores()
    
    // Listen for cart updates
    const interval = setInterval(loadCartCount, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Determine current store from URL
    const storeIdMatch = location.pathname.match(/\/store\/(\d+)/)
    if (storeIdMatch) {
      const storeId = parseInt(storeIdMatch[1])
      const store = stores.find(s => s.Id === storeId)
      setCurrentStore(store)
    } else {
      setCurrentStore(null)
    }
  }, [location.pathname, stores])

  const loadCartCount = async () => {
    try {
      const cart = await cartService.getCart()
      const count = cart.reduce((total, item) => total + item.quantity, 0)
      setCartCount(count)
    } catch (error) {
      console.error("Failed to load cart count:", error)
    }
  }

  const loadStores = async () => {
    try {
      const storesData = await storeService.getAll()
      setStores(storesData)
    } catch (error) {
      console.error("Failed to load stores:", error)
    }
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set("q", query.trim())
      if (currentStore) {
        navigate(`/store/${currentStore.Id}?${searchParams.toString()}`)
      } else {
        navigate(`/?${searchParams.toString()}`)
      }
    }
  }

  const handleStoreSelect = (store) => {
    setCurrentStore(store)
    setShowStoreDropdown(false)
    navigate(`/store/${store.Id}`)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Store" className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-bold gradient-text">
                  MarketHub
                </h1>
                {currentStore && (
                  <p className="text-xs text-gray-600">
                    {currentStore.name} Store
                  </p>
                )}
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar 
                onSearch={handleSearch}
                placeholder={currentStore ? `Search in ${currentStore.name}...` : "Search all stores..."}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Store Selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Grid3X3" className="w-5 h-5" />
                  <span>{currentStore ? currentStore.name : "All Stores"}</span>
                  <ApperIcon name="ChevronDown" className="w-4 h-4" />
                </Button>

                {showStoreDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-premium border border-gray-200 py-2 z-50"
                  >
                    <button
                      onClick={() => {
                        setCurrentStore(null)
                        setShowStoreDropdown(false)
                        navigate("/")
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Grid3X3" className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">All Stores</div>
                        <div className="text-xs text-gray-500">Browse everything</div>
                      </div>
                    </button>
                    {stores.map((store) => (
                      <button
                        key={store.Id}
                        onClick={() => handleStoreSelect(store)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${store.themeColor}20` }}
                        >
                          <ApperIcon 
                            name={store.icon} 
                            className="w-4 h-4"
                            style={{ color: store.themeColor }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{store.name}</div>
                          <div className="text-xs text-gray-500">{store.categories.length} categories</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Cart */}
              <Button
                variant="ghost"
                onClick={() => navigate("/cart")}
                className="relative flex items-center gap-2"
              >
                <ApperIcon name="ShoppingCart" className="w-5 h-5" />
                <span className="hidden lg:inline">Cart</span>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/cart")}
                className="relative p-2"
              >
                <ApperIcon name="ShoppingCart" className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold">Menu</h2>
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="mb-6">
            <SearchBar 
              onSearch={(query) => {
                handleSearch(query)
                setIsMobileMenuOpen(false)
              }}
              placeholder="Search products..."
            />
          </div>

          {/* Mobile Store List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Browse Stores</h3>
            <button
              onClick={() => {
                setCurrentStore(null)
                setIsMobileMenuOpen(false)
                navigate("/")
              }}
              className="w-full p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Grid3X3" className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">All Stores</div>
                <div className="text-sm text-gray-500">Browse everything</div>
              </div>
            </button>
            {stores.map((store) => (
              <button
                key={store.Id}
                onClick={() => {
                  handleStoreSelect(store)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${store.themeColor}20` }}
                >
                  <ApperIcon 
                    name={store.icon} 
                    className="w-5 h-5"
                    style={{ color: store.themeColor }}
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{store.name}</div>
                  <div className="text-sm text-gray-500">{store.categories.length} categories</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Click outside to close dropdowns */}
      {showStoreDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowStoreDropdown(false)}
        />
      )}
    </>
  )
}

export default Header