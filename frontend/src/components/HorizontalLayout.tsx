import React from 'react'

interface HorizontalLayoutProps {
  children: React.ReactNode
  className?: string
}

const HorizontalLayout: React.FC<HorizontalLayoutProps> = ({ children, className }) => {
  return (
    <div className={`w-full flex items-center align-middle gap-4 ${className || ''}`}>
      {children}
    </div>
  )
}

export default HorizontalLayout
