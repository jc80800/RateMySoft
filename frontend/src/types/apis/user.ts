// Central API request/response types used across client and server proxies
// Prefer importing response DTOs from Zod schemas to avoid duplication.
import type { UserDto, LoginSuccess, LoginError } from '@/types/schemas/user'

export interface LoginRequest {
  email: string
  password: string
}

export type LoginResponse = LoginSuccess | LoginError

export interface RegisterRequest {
  email: string
  password: string
  handle?: string
}

export interface RegisterResponse {
  user?: UserDto
  detail?: string
  error?: string
}

export interface ApiError {
  error?: string
  detail?: string
}

export type ApiResponse<T> = T | ApiError
