import { z } from 'zod'


export const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string()
})

export const RegisterRequestSchema = z.object({
  handle: z.string(),
  email: z.string(),
  password: z.string()
})

export const UserDOSchema = z.object({
  id: z.string(),
  email: z.string(),
  handle: z.string(),
  role: z.enum(['user', 'admin']),
})

export const ProfileResponseSchema = UserDOSchema;

export const AuthSchema = z.object({
  user: UserDOSchema,
  token: z.string(),
})

export type AuthResponse = z.infer<typeof AuthSchema>
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type UserDO = z.infer<typeof UserDOSchema>

