import { Post, Community, Vote, User, Comment } from "@prisma/client"

export type ExtendedPost = Post & {
  community: Community
  votes: Vote[]
  author: User
  comments: Comment[]
}

export type PostwithComments = Post & {
  votes: Vote[]
}
