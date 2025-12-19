import React from 'react'
import { twMerge } from 'tailwind-merge'

interface VerticalLayoutProps {
  children: React.ReactNode
  className?: string
}

const VerticalLayout: React.FC<VerticalLayoutProps> = ({ children, className }) => {
  return (
    <div className={twMerge('flex flex-col gap-5', className)}>
      {children}
    </div>
  )
}

export default VerticalLayout
