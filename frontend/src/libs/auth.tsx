import { NextAuthOptions, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { AuthResponse, AuthRequest } from '@/types/apis/user'
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        // UserApi is exported as a class — instantiate it first

        // Call the backend; if it fails we want to throw so the client
        // `signIn(..., { redirect: false })` receives the error and does not redirect.
        try {
          const payload: AuthRequest = { email: credentials.email, password: credentials.password }
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          const json = await res.json().catch(() => ({}))

          // runtime-validate the auth response shape
          const isAuthResponse = (x: unknown): x is AuthResponse => {
            if (!x || typeof x !== 'object') return false
            const o = x as any
            if (o.user) {
              return typeof o.user.id === 'string' && typeof o.user.email === 'string'
            }
            return typeof o.message === 'string' || typeof o.error === 'string'
          }

          if (!isAuthResponse(json)) {
            throw new Error('Invalid response from auth server')
          }

          const data = json as AuthResponse

          // If backend indicates failure, throw so NextAuth surface the error to the client
          if (!data || !data.user) {
            const msg = data && data.message ? String(data.message) : 'Invalid credentials'
            throw new Error(msg)
          }

          const { user, token } = data

          // Return a plain object representing the authenticated user.
          // NextAuth expects either an object (truthy) or null.
          return {
            ...user,
            // include token so callbacks (if added) can read it
            token,
          }
        } catch (err) {
          // Re-throw a normalized Error so the client receives a readable message.
          const message = err instanceof Error ? err.message : String(err)
          throw new Error(message || 'Unable to sign in')
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Persist the token from authorize() into the JWT without using `any` casts
  async jwt({ token, user }: { token: JWT & { accessToken?: string; user?: { id?: string; email?: string | null; name?: string | null } }; user?: User & { token?: string } }) {
      // On initial sign in, `user` will be set and may contain the `token` we returned
        if (user && user.token) {
        token.accessToken = user.token
        // copy basic user fields so we can access them on the client
           token.user = {
             id: user.id,
             email: user.email ?? null,
             name: user.name ?? null,
           }
      }
      return token
    },

    // Make the token available in the session object returned to the client
  async session({ session, token }: { session: Session & { accessToken?: string }; token: JWT & { accessToken?: string; user?: { id?: string; email?: string | null; name?: string | null } } }) {
      // Attach accessToken and user info (typed)
      session.accessToken = token.accessToken
      if (token.user) {
        // token.user may contain nullable fields, but session.user expects strings
        session.user = {
          ...session.user,
          id: token.user.id,
          email: token.user.email ?? undefined,
          name: token.user.name ?? undefined,
        }
      }
      return session
    },
  },
}