import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "bg-transparent text-primary-600 px-6 py-3 rounded-lg font-medium border-2 border-primary-600 hover:bg-primary-600 hover:text-white active:scale-[0.98] transition-all duration-200",
    ghost: "bg-transparent text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 active:scale-[0.98] transition-all duration-200",
    danger: "bg-gradient-to-r from-error-500 to-error-600 text-white px-6 py-3 rounded-lg font-medium hover:from-error-600 hover:to-error-700 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <button
      className={cn(
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button