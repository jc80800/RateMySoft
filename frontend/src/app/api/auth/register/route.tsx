import { NextResponse } from 'next/server'
import type { RegisterRequest } from '@/types/apis/user'
import { RegisterSuccessSchema, RegisterErrorSchema } from '@/types/schemas/user'

// Proxy POST /api/auth/register to backend defined by BACKEND_URI
export async function POST(req: Request) {
  const body = (await req.json()) as RegisterRequest
  const backend = process.env.BACKEND_URI

  const res = await fetch(`${backend}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))
  const parsed = (res.ok ? RegisterSuccessSchema : RegisterErrorSchema).safeParse(data)
  if (!parsed.success) {
    console.error('Register response validation failed', parsed.error)
    return NextResponse.json({ error: 'Invalid response from upstream auth' }, { status: 502 })
  }

  return NextResponse.json(parsed.data, { status: res.status })
}
