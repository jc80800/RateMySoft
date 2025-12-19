'use client'

import { ReactNode, useEffect, useRef, useState, MouseEvent } from 'react'
import VerticalLayout from '../layouts/VerticalLayout'

type DropdownMenuProps = {
  button: ReactNode
  children: ReactNode
}

const DropdownMenu = ({ button, children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const toggleDropdown = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsOpen(prev => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement)?.closest('[data-keep-open="true"]')
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect()
      const windowWidth = window.innerWidth

      if (menuRect.left < 0) {
        menuRef.current.style.left = '0px'
        menuRef.current.style.right = 'auto'
      } else if (menuRect.right > windowWidth) {
        menuRef.current.style.left = 'auto'
        menuRef.current.style.right = '0px'
      }
    }
  }, [isOpen])

  return (
    <div className="relative inline-flex flex-col items-stretch text-left">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
      >
        {button}
      </button>

      {isOpen && (
        <div ref={menuRef}>
          <VerticalLayout
            className="origin-top-right absolute right-0 mt-1 w-full shadow-lg bg-white ring-1 ring-(--light-gray) ring-opacity-5 z-40 rounded-md"
          >
            <ul className="w-full">{children}</ul>
          </VerticalLayout>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu