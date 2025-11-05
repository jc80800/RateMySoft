import React from 'react'
import BlackBtn from '../buttons/BlackBtn'
import WhiteBtn from '../buttons/WhiteBtn'
import HorizontalLayout from '../HorizontalLayout'
import { useRouter } from 'next/navigation'

const LoggedOut = () => {
  const router = useRouter()

  return (
    <HorizontalLayout>
      <WhiteBtn onClick={() => router.push('/auth/login')}>Sign In</WhiteBtn>
      <BlackBtn onClick={() => router.push('/auth/register')}>Sign Up</BlackBtn>
    </HorizontalLayout>

  )
}

export default LoggedOut