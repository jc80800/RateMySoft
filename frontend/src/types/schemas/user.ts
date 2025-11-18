import { z } from 'zod'

export const UserDtoSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable().optional(),
})

// Login (success) and (error) response shapes
export const LoginSuccessSchema = z.object({
  user: UserDtoSchema,
  token: z.string(),
})

export const LoginErrorSchema = z.object({
  message: z.string().optional(),
  detail: z.string().optional(),
  error: z.string().optional(),
}).refine((v) => Boolean(v.message || v.detail || v.error), {
  message: 'Login error must include message or error',
})

export type UserDto = z.infer<typeof UserDtoSchema>
export type LoginSuccess = z.infer<typeof LoginSuccessSchema>
export type LoginError = z.infer<typeof LoginErrorSchema>

// Register (success) and (error) response shapes
export const RegisterSuccessSchema = z.object({
  user: UserDtoSchema.optional(),
  message: z.string().optional(),
})

export const RegisterErrorSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
  detail: z.string().optional(),
}).refine((v) => Boolean(v.message || v.error || v.detail), {
  message: 'Register error must include message or error',
})

export type RegisterSuccess = z.infer<typeof RegisterSuccessSchema>
export type RegisterError = z.infer<typeof RegisterErrorSchema>
