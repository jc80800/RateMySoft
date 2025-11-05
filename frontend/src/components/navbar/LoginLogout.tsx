"use client"
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import React from 'react'
import LoggedIn from './LoggedIn'
import LoggedOut from './LoggedOut'

type Props = {
  initialSession: Session | undefined
}

const LoginLogout: React.FC<Props> = ({ initialSession }) => {
  const { data: clientSession, status } = useSession()
  const session = clientSession ?? initialSession
  const loading = status === 'loading'

  if (loading && !session) return <div>Loading...</div>

  return session ? (
    <LoggedIn/>
  ) : (
    <LoggedOut/>
  )
}

export default LoginLogout