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
  }),
})

export const { useGetAllQuery, useCreateCommunityMutation } = communityApi
