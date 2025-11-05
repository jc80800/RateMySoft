"use client"

import { useState } from 'react'

import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import BlackBtn from '@/components/buttons/BlackBtn'

export default function RegisterPage() {
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    setError('')
    setLoading(true)

    try {
  
  
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
  
          const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({email, password, handle})
            })
  
        // parse the JSON response body
        const data = await res.json()
  
        if (!res.ok) {
          setError(data?.error || 'Failed to sign up')
        } 
      } catch (err: any) {
        setError(err?.message || 'An unexpected error occurred')
      }
    setLoading(false)
  }

  return (
    <Form title="Create Account" description="Join RateMySoft today!" onSubmit={handleSubmit} error={error}>

        <TextInput
          inputType="email"
          labelText="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          inputType="text"
          labelText="Username (Handle)"
          placeholder="Choose a unique username"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />

        <TextInput
          inputType="password"
          labelText="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextInput
          inputType="password"
          labelText="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        

        <BlackBtn type="submit">
          {loading ? 'Creating account...' : 'Creating account'}
        </BlackBtn>

      <footer className="mt-8 text-center pt-6 border-t-2 border-gray-200">
        <p className="text-gray-500 text-sm">
          Already have an account?{' '}
          <a href="/auth/login" className="text-(--bamboo-green) font-semibold hover:text-black hover:underline">
            Sign in here
          </a>
        </p>
      </footer>
    </Form>
  )
}