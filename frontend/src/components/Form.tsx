
import React from "react"
import VerticalLayout from "./layouts/VerticalLayout"
import ErrorMsg from "./msgs/ErrorMsg"

interface FormProps {
  children: React.ReactNode
  title: string
  description: string
  onSubmit?: (event?: React.FormEvent<HTMLFormElement>) => void | Promise<void>
  error?: string | null
  className?: string
}

const Form: React.FC<FormProps> = ({ children, title, description, onSubmit, error, className }) => {
  return (
    <form className={`min-h-[calc(100vh-140px)] flex items-center justify-center p-8 bg-gradient-to-br from-[rgba(124,179,66,0.05)] via-[rgba(255,255,255,0.9)] to-[rgba(240,240,240,0.8)] ${className || ""}`} onSubmit={onSubmit} >
      <div className="relative bg-white rounded-2xl shadow-[0_10px_40px_rgba(26,26,26,0.1),0_0_0_1px_rgba(26,26,26,0.05)] p-12 w-full max-w-xl border-2 border-black overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[var(--bamboo-green)] via-black to-[var(--bamboo-green)]" />
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-black mb-2 tracking-tight">{title}</h1>
          <p className="text-gray-500 text-sm">{description}</p>
        </header>
        
        <VerticalLayout>
            {error && error.length > 0 && <ErrorMsg>{error}</ErrorMsg>}
            {children}
        </VerticalLayout>
      </div>
    </form>
  )
}

export default Form