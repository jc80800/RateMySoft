import { NextResponse } from 'next/server'
import type { AuthRequest } from '@/types/apis/user'
import { AuthResponseSchema } from '@/types/schemas'

// Proxy POST /api/auth/login to backend defined by BACKEND_URI
export async function POST(req: Request) {
  const body = (await req.json()) as AuthRequest
  const backend = process.env.BACKEND_URI

  const res = await fetch(`${backend}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))

  const parsed = AuthResponseSchema.safeParse(data)
  if (!parsed.success) {
    console.error('Auth response validation failed', parsed.error)
    return NextResponse.json({ error: 'Invalid response from upstream auth' }, { status: 502 })
  }

  return NextResponse.json(parsed.data, { status: res.status })
}
