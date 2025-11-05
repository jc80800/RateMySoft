// Shared auth-related interfaces
export interface AuthUser {
  id: string
  email: string 
  name: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export default AuthUser
