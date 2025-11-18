"use client"

import { useState } from 'react'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import BlackBtn from '@/components/buttons/BlackBtn'
import { AuthResponse, RegisterRequest } from '@/types/schemas/user'
import { UserApi } from '@/apis/userApi'
import { useAuth } from '@/contexts/authContext'

export default function RegisterPage() {
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {login} = useAuth();

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    if(email.length == 0 || password.length == 0 || handle.length == 0){
      setError("All fileds are required")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const request : RegisterRequest = {email, password, handle};

    try{
      const registerRes : AuthResponse = await UserApi.register(request);
      login(registerRes);
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'An unexpected error occurred')
    } finally{
      setLoading(false)
    }
  }

  return (
    <Form title="Create Account" description="Join RateMySoft today!" onSubmit={handleSubmit} error={error}>

        <TextInput
          inputType="email"
          labelText="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isRequired={true}
        />

        <TextInput
          inputType="text"
          labelText="Username (Handle)"
          placeholder="Choose a unique username"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
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

        <TextInput
          inputType="password"
          labelText="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isRequired={true}
        />

        

        <BlackBtn type="submit">
          {loading ? 'Creating account...' : 'Create Account'}
        </BlackBtn>

      <footer className="mt-8 text-center pt-6 border-t-2 border-gray-200">
        <p className="text-gray-500 text-sm">
          Already have an account?{' '}
          <a href="/auth/login" className="highlight">
            Sign in here
          </a>
        </p>
      </footer>
    </Form>
  )
}