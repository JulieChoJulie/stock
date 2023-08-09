import { z } from "zod"

export const commentValidator = z.object({
  postId: z.string(),
  text: z.string().min(1),
  replyToId: z.string().optional(),
})

export type commentRequest = z.infer<typeof commentValidator>
