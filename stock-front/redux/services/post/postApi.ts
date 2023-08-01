import { homepageUrl } from "@/lib"
import { PostCreationRequest } from "@/lib/validators/post"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${homepageUrl}/api/`,
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    createPost: builder.mutation<string, PostCreationRequest>({
      query: ({ title, content, communityId }) => {
        const payload: PostCreationRequest = {
          title,
          content,
          communityId,
        }
        return {
          url: `/post/create`,
          method: "POST",
          body: {
            payload,
          },
          responseHandler: (response) => response.text(),
        }
      },
    }),
  }),
})

export const { useCreatePostMutation } = postApi
