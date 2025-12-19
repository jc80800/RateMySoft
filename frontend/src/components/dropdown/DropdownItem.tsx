import Link from 'next/link'
import { ReactNode } from 'react'

type DropdownItemProps = {
  children: ReactNode
  href?: string
  icon?: ReactNode
  onClick?: () => void
  extraStyle?: string
}

const baseClasses = `
  flex items-center w-full
  text-sm font-medium text-gray-600
  rounded-md hover:bg-gray-100
  px-4 h-12 gap-x-2 whitespace-nowrap
`

const DropdownItem = ({
  children,
  href,
  icon,
  onClick,
  extraStyle = '',
}: DropdownItemProps) => {
  // Navigation case (SSR-safe)
  if (href) {
    return (
      <li className="w-full">
        <Link href={href} className={`${baseClasses} ${extraStyle}`}>
          {icon}
          <span>{children}</span>
        </Link>
      </li>
    )
  }

  // Action case (CLIENT-ONLY usage)
  return (
    <li className="w-full">
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${extraStyle} text-left`}
      >
        {icon}
        <span>{children}</span>
      </button>
    </li>
  )
}

export default DropdownItem