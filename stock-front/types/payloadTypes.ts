import type { Post } from "@prisma/client"

export type setCommunityPayloadType = {
  posts: Post[]
  isSubscribed: boolean
  memberCount: number
  creatorId: string | null
  communityName: string
  communityId: string
}
