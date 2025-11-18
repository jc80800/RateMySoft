import React from 'react'

interface HorizontalLayoutProps {
  children: React.ReactNode
  className?: string
}

const HorizontalLayout: React.FC<HorizontalLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`flex flex-row items-center gap-4 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
export default HorizontalLayout
