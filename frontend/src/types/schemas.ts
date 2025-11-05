import { z } from 'zod'

export const UserDtoSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable().optional(),
})

export const AuthResponseSchema = z.object({
  user: UserDtoSchema.optional(),
  token: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export const RegisterResponseSchema = z.object({
  user: UserDtoSchema.optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export type UserDto = z.infer<typeof UserDtoSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
