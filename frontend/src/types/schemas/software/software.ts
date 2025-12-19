import { z } from 'zod'

export const SoftwareSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  total_reviews: z.number(),
  avg_rating: z.number()
})

export type Software = z.infer<typeof SoftwareSchema>