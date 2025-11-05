import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    // Access token returned by your backend
    accessToken?: string

    // Keep the default user fields and include id
    user: DefaultSession["user"] & {
      id?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    user?: {
      id?: string
      email?: string | null
      name?: string | null
    }
  }
}
