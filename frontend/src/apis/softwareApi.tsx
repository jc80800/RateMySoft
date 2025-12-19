import { Software } from "@/types/schemas/software/software"
import { SoftwareSortType } from "@/types/schemas/software/softwareSortType"
import { serverFetch } from "./serverFetch"

interface GetProductsProps{
    category : string | undefined,
    sortType : SoftwareSortType
    search : string | undefined
    page : number
}


export class SoftwareApi {

  static getSoftwares = async({category, sortType, search, page} : GetProductsProps) : Promise<Software[]> => {
    const params = new URLSearchParams()

    params.set('sortType', sortType)
    params.set('page', page.toString());
    if (category) params.set('category', category)
    if (search) params.set('search', search)

    params.set('page', '1')

    const res = await serverFetch(`/products?${params.toString()}`, {
      cache: 'force-cache',
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await res.json()
    return data.products
  }

  static getAvailbelCategories = async() : Promise<string[]> => {
    // TODO: fetch from API
    // const res = await serverFetch(`/products/availble-categories`, {
    //   cache: 'force-cache',
    //     next: { revalidate: 600 },
    // })

    // if (!res.ok) {
    //   console.error('Failed to fetch getAvailbelCategories')
    //   return []
    // }

    // return res.json()

    return ["Backend", "Frontend", "Database"]
  }
}