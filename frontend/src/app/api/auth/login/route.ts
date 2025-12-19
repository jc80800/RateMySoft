import { NextResponse } from 'next/server'
import { AuthSchema, LoginRequest } from '@/types/schemas/user'
import { ApiErrorSchema } from '@/types/schemas/shared'
import { HYGIENED_ERROR_MSG } from '@/types/constants/constants'

// Proxy POST /api/auth/login to backend defined by BACKEND_URI
export async function POST(req: Request) {
  const body = (await req.json()) as LoginRequest
  const backend = process.env.BACKEND_URI

  const res = await fetch(`${backend}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))

  const schema = res.ok ? AuthSchema : ApiErrorSchema
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    console.error('Auth response validation failed', parsed.error)
    return NextResponse.json({ error: HYGIENED_ERROR_MSG }, { status: 502 })
  }

  return NextResponse.json(parsed.data, { status: res.status })
}
