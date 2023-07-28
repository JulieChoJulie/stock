import { homepageUrl } from "@/lib"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const communityApi = createApi({
  reducerPath: "communityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${homepageUrl}/api/`,
  }),
  tagTypes: ["Communities"],
  endpoints: (builder) => ({
    getAll: builder.query<string, void>({
      query: () => `communities`,
    }),
    createCommunity: builder.mutation<string, string>({
      query: (name) => {
        return {
          url: `community`,
          method: "POST",
          body: {
            name,
          },
        }
      },
    }),
    subscribeCommunity: builder.mutation<void, string>({
      query: (communityId) => {
        return {
          url: `community/subscribe`,
          method: "POST",
          body: {
            communityId,
          },
          responseHandler: (response) => response.text(),
        }
      },
    }),
    unsubscribeCommunity: builder.mutation<void, string>({
      query: (communityId) => {
        return {
          url: `community/unsubscribe`,
          method: "POST",
          body: { communityId },
          responseHandler: (response) => response.text(),
        }
      },
    }),
  }),
})

export const {
  useGetAllQuery,
  useCreateCommunityMutation,
  useSubscribeCommunityMutation,
  useUnsubscribeCommunityMutation,
} = communityApi
