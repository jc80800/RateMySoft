import { SoftwareApi } from '@/apis/softwareApi'
import HorizontalLayout from '@/components/layouts/HorizontalLayout'
import VerticalLayout from '@/components/layouts/VerticalLayout'
import SoftwareList from '@/components/software/SoftwareList'
import SoftwareSearchInput from '@/components/software/SoftwareSearchInput'
import { Software } from '@/types/schemas/software/software'
import { SoftwareSortType } from '@/types/schemas/software/softwareSortType'

interface SoftwarePageProps{
  searchParams:{
    category?: string
    sortBy?: SoftwareSortType
    search?: string
    page?: string
  }
}


const SoftwarePage = async ({searchParams} : SoftwarePageProps)=> {
  const params = await searchParams

  const category = params.category

  const sortType: SoftwareSortType =
    params.sortBy ?? 'Price'

  const search = params.search

  const page =
    Number.isInteger(Number(params.page)) &&
    Number(params.page) > 0
      ? Number(params.page)
      : 1

  const softwareData: Software[] =
    await SoftwareApi.getSoftwares({
      category,
      sortType,
      search,
      page,
    })

  const availableCategories = await SoftwareApi.getAvailbelCategories()

  return (
    <VerticalLayout className="items-center">
      <VerticalLayout>
        <h1>Software Directory</h1>
        <p>Discover and compare software solutions</p>
      </VerticalLayout>

      <VerticalLayout>
        <SoftwareSearchInput
          category={category}
          sortType={sortType}
          availableCategories={availableCategories}
          search={search}
        />
        <SoftwareList softwares={softwareData} />
      </VerticalLayout>
    </VerticalLayout>
  )
}

export default SoftwarePage