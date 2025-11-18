"use client"
import React from 'react'
import LoggedIn from './LoggedIn'
import LoggedOut from './LoggedOut'
import { useAuth } from '@/contexts/authContext'



const LoginLogout: React.FC = () => {
  const {isLoading, user} = useAuth();

  if (isLoading) return <div>Loading...</div>

  return user ? (
    <LoggedIn/>
  ) : (
    <LoggedOut/>
  )
}

export default LoginLogout