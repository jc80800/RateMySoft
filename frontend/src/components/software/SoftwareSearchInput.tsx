import { ReactNode } from 'react'
import HorizontalLayout from '../layouts/HorizontalLayout'
import DropdownMenu from '../dropdown/DropdownMenu'
import DropdownItem from '../dropdown/DropdownItem'
import DropdownBtn from './DropdownBtn'
import PriceIcon from '../icons/PriceIcon'
import StarIcon from '../icons/StarIcon'
import SortByNameIcon from '../icons/SortByNameIcon'
import { SoftwareSortType } from '@/types/schemas/software/softwareSortType'
import SearchBar from '../SearchBar'



type SoftwareSearchListsProps = {
  category?: string
  sortType: SoftwareSortType
  search?: string
  availableCategories: string[]
}

const SoftwareSearchInput = ({
  category,
  sortType,
  search,
  availableCategories,
}: SoftwareSearchListsProps) => {
  const availbleSortTypes: SoftwareSortType[] = ['Price', 'Rate', 'Name']

  const sortTypeIcons: Map<SoftwareSortType, ReactNode> = new Map([
    ['Price', <PriceIcon />],
    ['Rate', <StarIcon />],
    ['Name', <SortByNameIcon />],
  ])

  return (
    <HorizontalLayout className="bg-white p-4 rounded-2xl shadow justify-between">
      <SearchBar
        defaultInput={search}
        name="search"
        className="w-3/5"
        preservedParams={{
          category,
          sortType,
        }}
      />

      <HorizontalLayout>
        <DropdownMenu
          button={<DropdownBtn text={category ? category : 'All categories'} />}
        >
          {availableCategories.map((availableCategory) => {
            const params = new URLSearchParams()
            if (search) params.set('search', search)
            if (sortType) params.set('sortType', sortType)
            params.set('category', availableCategory)

            return (
              <DropdownItem
                key={availableCategory}
                href={`?${params.toString()}`}
              >
                {availableCategory}
              </DropdownItem>
            )
          })}
        </DropdownMenu>

        <DropdownMenu button={<DropdownBtn text={'Sort By ' + sortType} />}>
          {availbleSortTypes.map((availbleSortType) => {
            const params = new URLSearchParams()
            if (search) params.set('search', search)
            if (category) params.set('category', category)
            params.set('sortType', availbleSortType)

            return (
              <DropdownItem
                key={availbleSortType}
                href={`?${params.toString()}`}
                icon={sortTypeIcons.get(availbleSortType)}
              >
                {availbleSortType}
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </HorizontalLayout>
    </HorizontalLayout>
  )
}

export default SoftwareSearchInput
