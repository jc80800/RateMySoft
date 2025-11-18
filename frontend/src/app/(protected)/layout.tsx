import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = (await cookies()).get('authToken')?.value
  console.log(token)
  // No need to compute current path here; middleware builds ?next
  if (!token) redirect('/auth/login')
  
  const res = await fetch(`${process.env.BACKEND_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) redirect('/auth/login')

  return <>{children}</>
}
