import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

const WhiteBtn: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-5.5 py-2.5 relative overflow-hidden bg-white text-black border-2 border-black font-medium tracking-tight rounded-xl transition-all transform-gpu duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] hover:-translate-y-[2px] hover:scale-105 hover:bg-black hover:text-white! hover:shadow-[0_8px_20px_rgba(124,179,66,0.4)]"
    >
      <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 hover:left-full" />
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export default WhiteBtn