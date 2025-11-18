const PROTECTED_MATCHER = ['/protected/:path*']

export function middleware(req: Request) {
  const url = new URL(req.url)
  const { pathname, search } = url
  const isProtected = PROTECTED_MATCHER.some((pattern) => {
    // simple startsWith check based on matcher base path
    const base = pattern.replace('/:path*', '')
    return pathname.startsWith(base)
  })
  if (!isProtected) return

  // simple cookie parsing from the Cookie header
  const cookiesHeader = req.headers.get('cookie') || ''
  const token = cookiesHeader
    .split(';')
    .map((c) => c.trim())
    .map((c) => {
      const [k, ...v] = c.split('=')
      return { k, v: decodeURIComponent(v.join('=')) }
    })
    .find((c) => c.k === 'authToken')?.v

  if (token) return

  const loginUrl = new URL('/auth/login', url)
  const next = pathname + (search ? search : '')
  loginUrl.searchParams.set('redirect', next)
  return new Response(null, {
    status: 307,
    headers: {
      Location: loginUrl.toString(),
    },
  })
}

export const config = {
  matcher: PROTECTED_MATCHER,
}

