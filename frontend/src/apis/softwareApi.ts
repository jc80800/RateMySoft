// src/apis/softwareApi.tsx
import { Software } from '@/types/schemas/software/software'
import { SoftwareSortType } from '@/types/schemas/software/softwareSortType'
import { serverFetch } from './serverFetch.server'
import { HYGIENED_ERROR_MSG } from '@/types/constants/constants'

interface GetProductsProps {
  category?: string
  sortType: SoftwareSortType
  search?: string
  page: number
}

export class SoftwareApi {
  static async getSoftwares({
    category,
    sortType,
    search,
    page,
  }: GetProductsProps): Promise<Software[]> {
    const params = new URLSearchParams()

    params.set('sortType', sortType)
    params.set('page', page.toString())
    if (category) params.set('category', category)
    if (search) params.set('search', search)

    const res = await serverFetch(
      `/api/products?${params.toString()}`,
      {},
      { mode: 'isr', revalidate: 60 }
    )

    const data = await res.json().catch(() => null)

    if (!res.ok) { 
      console.error("Failed to get softwares: ", data.error);
      throw new Error(data)
    }

    return data.products as Software[];
  }

  static async getCategories() : Promise<string[]> {
    const res = await serverFetch("/api/products/categories");
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      console.error("Failed to get softwares: ", data.error);
      return[];
    }
    return data.categories;
  }
}