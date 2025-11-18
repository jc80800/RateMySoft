import { z } from 'zod'

export const ApiErrorSchema = z.object({
  error: z.string(),
  detail: z.string().optional(),
}).refine((v) => Boolean(v.error || v.detail), {
  message: 'API error must include message/detail/error',
})

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>