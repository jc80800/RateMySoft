import React from 'react'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const baseClasses =
  'px-5.5 py-2.5 relative overflow-hidden [background-color:var(--bamboo-light)] text-white border-2 font-medium tracking-tight rounded-4xl transition-all transform-gpu duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] hover:-translate-y-[2px] hover:scale-105 hover:shadow-[0_8px_20px_rgba(124,179,66,0.4)]'

const GreenBtn: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  type = 'button',
}) => {
  // Navigation case (SSR-safe)
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={baseClasses}>
        <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 hover:left-full" />
        <span className="relative z-10">{children}</span>
      </Link>
    )
  }

  // Action case (client-only usage)
  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
    >
      <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 hover:left-full" />
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export default GreenBtn