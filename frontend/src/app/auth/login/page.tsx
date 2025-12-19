"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import BlackBtn from '@/components/buttons/BlackBtn'
import { AuthResponse, LoginRequest } from '@/types/schemas/user'
import { UserApi } from '@/apis/userApi'
import { useAuth } from '@/contexts/authContext'
import { ClientSideError } from '@/types/errors/error'
import { HYGIENED_ERROR_MSG } from '@/types/constants/constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const { login } = useAuth();

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    setError('')
    setLoading(true)

    try {
      const loginReq: LoginRequest = { email, password }
      const authRes: AuthResponse = await UserApi.login(loginReq);
      login(authRes);
      router.replace(next)
    } catch (err) {
      if (err instanceof ClientSideError) {
        setError(err.message)
      } else {
        setError(HYGIENED_ERROR_MSG)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form title="Welcome Back!" description="Sign in to continue" onSubmit={handleSubmit} error={error}>

      <TextInput
        inputType="email"
        labelText="Email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isRequired={true}
      />

      <TextInput
        inputType="password"
        labelText="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isRequired={true}
      />

      <BlackBtn type="submit">
        {loading ? 'Signing in...' : 'Sign In'}
      </BlackBtn>

      <footer className="mt-8 text-center pt-6 border-t-2 border-var(--light-gray)">
        <p className="text-(--light-gray)">
          Don’t have an account?{' '}
          <a href="/auth/register" className="highlight">
            Sign up
          </a>
        </p>
      </footer>
    </Form>
  )
}
