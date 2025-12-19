import { z } from 'zod'

export const UNKNOWN_ERROR_MSG = "Unexpected error! Please try again later..."

export const ApiErrorSchema = z.object({
  error: z.string(),
})

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>
