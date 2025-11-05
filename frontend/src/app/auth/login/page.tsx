"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import BlackBtn from '@/components/buttons/BlackBtn'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the intended destination from navigation state or sessionStorage, default to home
  const getRedirectUrl = () => {
    // First check sessionStorage for pendingReview
    if (typeof window !== 'undefined') {
      const pendingReview = sessionStorage.getItem('pendingReview')
      if (pendingReview) {
        try {
          const parsed = JSON.parse(pendingReview)
          if (parsed?.redirectUrl) {
            return parsed.redirectUrl
          }
        } catch (e) {
          // ignore parse errors
          // eslint-disable-next-line no-console
          console.error('Failed to parse pendingReview:', e)
        }
      }
    }

    // Fallback to URL search param `from`
    const fromParam = searchParams?.get('from')
    return fromParam || '/'
  }

  const from = getRedirectUrl()

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result: any = await signIn('credentials', {
        redirect: false,
        // provider expects `email` as defined in credentials
        email,
        password,
      })

      // next-auth returns an object with `error` when sign-in fails
      if (result && result.error) {
        setError(result.error || 'Failed to sign in')
      } else {
        // Clear pendingReview from sessionStorage if it exists
        if (typeof window !== 'undefined' && sessionStorage.getItem('pendingReview')) {
          sessionStorage.removeItem('pendingReview')
        }

        // Redirect to the intended destination or home page
        router.replace(from)
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred')
    }

    setLoading(false)
  }

  return (
    <Form title="Welcome Back!" description="Sign in to continue" onSubmit={handleSubmit}>
        <TextInput
          inputType="email"
          labelText="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          inputType="password"
          labelText="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <BlackBtn type="submit">
          {loading ? 'Signing in...' : 'Sign In'}
        </BlackBtn>

      <footer className="mt-8 text-center pt-6 border-t-2 border-var(--light-gray)">
        <p className="text-light-gray text-sm">
          Don’t have an account?{' '}
          <a href="/auth/register" className="text-(--bamboo-green) font-semibold hover:text-black hover:underline">
            Sign up
          </a>
        </p>
      </footer>
    </Form>
  )
}