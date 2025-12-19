import React from 'react'
import BlackBtn from '../buttons/BlackBtn'
import WhiteBtn from '../buttons/WhiteBtn'
import HorizontalLayout from '../layouts/HorizontalLayout'
import { useRouter } from 'next/navigation'

const LoggedOut = () => {
  const router = useRouter()

  return (
    <HorizontalLayout className="text-nowrap">
      <BlackBtn onClick={() => router.push('/auth/login')}>Sign In</BlackBtn>
      <WhiteBtn onClick={() => router.push('/auth/register')}>Sign Up</WhiteBtn>
    </HorizontalLayout>

  )
}

export default LoggedOut