import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"

const SearchBar = ({ onSearch, placeholder = "Search products...", className = "" }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    // Real-time search for better UX
    if (value.trim().length > 2 || value.trim() === "") {
      setTimeout(() => onSearch(value.trim()), 300)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-4"
        />
      </div>
      <Button type="submit" size="md">
        <ApperIcon name="Search" className="w-5 h-5" />
      </Button>
    </form>
  )
}

export default SearchBar