import { cookies } from 'next/headers'

export type CacheMode =
  | { mode: 'dynamic' }
  | { mode: 'static' }
  | { mode: 'isr'; revalidate: number }

export async function serverFetch(
  endpoint: string,
  options: RequestInit = {},
  cacheMode: CacheMode = { mode: 'dynamic' }
) {
  const jwt = (await cookies()).get('authToken')?.value

  const fetchUrl = `${process.env.BACKEND_URI}${endpoint}`

  const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
  }

  switch (cacheMode.mode) {
    case 'dynamic':
      fetchOptions.cache = 'no-store'
      break

    case 'static':
      fetchOptions.cache = 'force-cache'
      break

    case 'isr':
      fetchOptions.next = { revalidate: cacheMode.revalidate }
      break
  }

  return fetch(fetchUrl, fetchOptions)
}