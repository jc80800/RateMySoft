// Central API request/response types used across client and server proxies

export interface UserDto {
  id: string
  email: string
  name?: string | null
}

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user?: UserDto
  token?: string
  // backend may return a message or an error key
  message?: string
  error?: string
}

export interface RegisterRequest {
  email: string
  password: string
  handle?: string
}

export interface RegisterResponse {
  user?: UserDto
  message?: string
  error?: string
}

export interface ApiError {
  error?: string
  message?: string
}

export type ApiResponse<T> = T | ApiError
