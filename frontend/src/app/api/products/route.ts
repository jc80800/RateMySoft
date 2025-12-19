// src/app/api/products/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SoftwareSchema } from '@/types/schemas/software/software'
import { HYGIENED_ERROR_MSG } from '@/types/constants/constants'

const ProductsResponseSchema = z.object({
  products: z.array(SoftwareSchema),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)

    // forward query params to backend
    const backendUrl =
      `${process.env.BACKEND_URI}/products?${url.searchParams.toString()}`

    const res = await fetch(backendUrl)
    const json = await res.json().catch(() => null)

    // backend returned error (4xx / 5xx)
    if (!res.ok) {
      return NextResponse.json(
        { error: json?.error ?? 'Failed to fetch products' },
        { status: res.status }
      )
    }

    // ✅ schema validation happens HERE
    const parsed = ProductsResponseSchema.safeParse(json)
    if (!parsed.success) {
      console.error('Schema validation failed', parsed.error)
      return NextResponse.json(
        { error: "Schema validation failed for ProductResposnseSchema" },
        { status: 502 }
      )
    }

    return NextResponse.json(parsed.data)
  } catch (err) {
    console.error('GET /api/products crashed', err)
    return NextResponse.json(
      { error: HYGIENED_ERROR_MSG },
      { status: 500 }
    )
  }
}