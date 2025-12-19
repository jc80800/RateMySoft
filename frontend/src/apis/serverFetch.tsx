import { cookies } from 'next/headers'


/**
 * serverFetch
 *
 * Server-only fetch helper for authenticated backend requests.
 *
 * How auth works:
 * 1. JWT is stored in an HttpOnly cookie (`authToken`)
 * 2. Browser automatically sends the cookie to Next.js
 * 3. This function reads the cookie on the SERVER
 * 4. JWT is forwarded to backend as `Authorization: Bearer <jwt>`
 *
 * IMPORTANT:
 * - Client code never sees or handles the JWT
 * - This must only be used in Server Components / Route Handlers
 */
export async function serverFetch(
  endpoint: string,
  options: RequestInit = {},
  cacheConfig?: { cache?: RequestCache; revalidate?: number }
) {
  const jwt = (await cookies()).get('authToken')?.value

  const fetchUrl = `${process.env.BACKEND_URI}${endpoint}`

  const res = await fetch(fetchUrl, {
    ...options,
    cache: cacheConfig?.cache ?? 'no-store',
    ...(cacheConfig?.revalidate !== undefined
      ? { next: { revalidate: cacheConfig.revalidate } }
      : {}),
    headers: {
      ...(options.headers || {}),
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  })

  return res
}