import React from 'react'
import { boolean } from 'zod'

interface TextInputProps {
  labelText?: string
  inputType?: string
  placeholder?: string
  value?: string 
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  className?: string
  isRequired?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
  labelText,
  inputType,
  placeholder,
  value,
  onChange,
  className,
  isRequired = false
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className ? className : ''}`}>
      {labelText && <label className="font-semibold text-black text-sm tracking-tight">{labelText}</label>}
      {inputType == 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="p-3 border-2 border-(--dark-gray) rounded-md text-base resize-y min-h-[100px] focus:outline-none focus:border-(--bamboo-green) focus:shadow-[0_0_0_3px_rgba(124,179,66,0.1)] transition-all"
        />
      ) : (
        <input
          type={inputType}
          required={isRequired}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="p-3 border-2 border-(--dark-gray) rounded-md text-base focus:outline-none focus:border-(--bamboo-green) focus:shadow-[0_0_0_3px_rgba(124,179,66,0.1)] transition-all"
        />
      )}
    </div>
  )
}

export default TextInput