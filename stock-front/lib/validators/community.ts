import { z } from "zod"

export const CommunityValidator = z.object({
  name: z.string().min(3).max(20),
})

export const CommunitySubscription = z.object({
  communityId: z.string(),
})

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>
export type CommunitySubscription = z.infer<typeof CommunitySubscription>
