'use client'

export interface FetchError extends Error {
  status?: number
  data?: any
}

export async function fetchHelper<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  // Get token from cookies in client-side environment
  const match = document.cookie.match(/(?:^|;\s*)authToken=([^;]*)/)
  const token = match ? decodeURIComponent(match[1]) : null

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }

  const res = await fetch(endpoint, config)

  let data: any
  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    data = await res.json()
  } else {
    data = await res.text()
  }

  if (!res.ok) {
    if (res.status === 404) {
      console.error('404 Not Found on:', endpoint, config.method)
      throw 'Unexpected Error! Please try again later'
    }

    const message =
      typeof data === 'string'
        ? data || 'Unexpected Error'
        : data?.error || data?.detail || 'Unexpected Error'

    const error: FetchError = new Error(message)
    error.status = res.status
    error.data = data
    throw error
  }

  return data as T
}