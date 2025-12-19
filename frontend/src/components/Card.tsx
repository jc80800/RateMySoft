import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`
        bg-white
        rounded-2xl
        p-6
        border-2 border-black
        relative
        box-border
        shadow-[0_4px_12px_rgba(26,26,26,0.1)]
        transition-all duration-300 ease-in-out
        hover:-translate-y-1
        hover:shadow-[0_8px_24px_rgba(26,26,26,0.15)]
        hover:border-(--bamboo-green)
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card