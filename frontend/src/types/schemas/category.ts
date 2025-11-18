import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
})

export type Category = z.infer<typeof CategorySchema>