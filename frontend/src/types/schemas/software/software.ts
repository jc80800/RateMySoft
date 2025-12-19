import { z } from 'zod'

export const SoftwareSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  short_tagline: z.string(),
  description: z.string(),
  total_reviews: z.number(),
  avg_rating: z.number()
})

export type Software = z.infer<typeof SoftwareSchema>