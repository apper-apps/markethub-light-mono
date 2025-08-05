import React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "input-field",
        error && "border-error-500 focus:ring-error-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input