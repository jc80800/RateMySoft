"use client"
import WhiteBtn from '../buttons/WhiteBtn'
import HorizontalLayout from '../layouts/HorizontalLayout'
import BlackBtn from '../buttons/BlackBtn'
import Image from 'next/image'
import { useAuth } from '@/contexts/authContext'

const LoggedIn = () => {
  const auth = useAuth();
  return (
    <HorizontalLayout>
      <BlackBtn>
        <HorizontalLayout>
          <Image src="/app-icon.png" alt="Avatar" width={30} height={30} />
          <h3>{auth.user?.handle}</h3>
        </HorizontalLayout>
      </BlackBtn>
      <WhiteBtn onClick={() => auth.logout()}>Logout</WhiteBtn>
    </HorizontalLayout>

  )
}

export default LoggedIn