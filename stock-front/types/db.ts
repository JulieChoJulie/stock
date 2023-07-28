import type { User, Vote } from "@prisma/client"

export interface PostWithVotesAndAuthor {
  author: User
  votes: Vote[]
}

export interface CommunityWithPosts {
  posts: PostWithVotesAndAuthor[]
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  creatorId: User
}
