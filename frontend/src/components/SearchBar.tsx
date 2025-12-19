'use client'

import { ReactNode, FormEvent } from 'react'
import HorizontalLayout from './layouts/HorizontalLayout'
import SearchIcon from './icons/SearchIcon'

interface SearchBarProps {
  /** Initial value from searchParams */
  defaultInput?: string

  /** Query param name, e.g. "q", "search", "keyword" */
  name?: string

  /** Optional icon */
  icon?: ReactNode

  /** Optional client-side hook (analytics, UI effects) */
  onSubmitClient?: (value: string) => void

  preservedParams?: Record<string, string | number | undefined>

  className?: string
}

const SearchBar = ({
  defaultInput = '',
  name = 'q',
  icon = <SearchIcon />,
  onSubmitClient,
  className="",
  preservedParams
}: SearchBarProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!onSubmitClient) return
    const form = e.currentTarget
    const input = form.elements.namedItem(name) as HTMLInputElement | null
    if (input) {
      onSubmitClient(input.value)
    }
    // Do NOT preventDefault — allow GET navigation for SSR
  }

  return (
    <form method="GET" onSubmit={handleSubmit} className={className}>
      {preservedParams &&
        Object.entries(preservedParams).map(([key, value]) =>
          value !== undefined ? (
            <input
              key={key}
              type="hidden"
              name={key}
              value={String(value)}
            />
          ) : null
        )}
      <div className="bg-white rounded-full shadow-lg p-1">
        <HorizontalLayout>
          <input
            name={name}
            defaultValue={defaultInput}
            className="font-bold rounded-full py-2 w-full pl-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none lg:text-sm text-xs"
            type="text"
            placeholder="Search"
          />

          <button
            type="submit"
            className="bg-(--bamboo-dark) text-white p-2 hover:bg-(--bamboo-light) cursor-pointer mx-0.5 rounded-full"
          >
            {icon}
          </button>
        </HorizontalLayout>
      </div>
    </form>
  )
}

export default SearchBar