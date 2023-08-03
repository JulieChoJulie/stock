import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
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
    getPostByName: builder.query({
      query: ({ page, communityName }) => {
        const infinite: number = 5
        const offset = page * infinite
        return `posts?offset=${offset}&page=${page}&limit=${infinite}${
          communityName ? `&communityName=${communityName}` : ""
        }`
      },
      transformResponse: (response, meta, arg) => {
        console.log("res: ", response)
        console.log("meta:", meta)
        console.log("arg: ", arg)
      },
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg,
      ) => {
        console.log("error response: ", response)
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName
      },
      merge: (currentCache, newItems) => {
        currentCache.results.push(...newItems.results)
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg
      },
    }),
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
        }
      },
    }),
  }),
})

export const { useCreatePostMutation, useGetPostByNameQuery } = postApi
