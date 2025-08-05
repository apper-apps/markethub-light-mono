import React from "react"
import Header from "@/components/organisms/Header"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}

export default Layout