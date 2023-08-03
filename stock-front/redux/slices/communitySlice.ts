import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { setCommunityPayloadType } from "@/types/propTypes"
import type { Post } from "@prisma/client"

export type KnownError = {
  message: string
  status: number | undefined
}

export interface communityState {
  isLoading: boolean
  isSubscribed: boolean | null
  memberCount: number
  communityId: string
  creatorId: string | null
  communityName: string
  posts: Post[]
  error: string | null
  status: number | null
}

export const subscribeCommunity = createAsyncThunk<
  string,
  string,
  { rejectValue: KnownError }
>("community/subscribe/post", async (communityId, { rejectWithValue }) => {
  try {
    const payload: { communityId: string } = {
      communityId,
    }
    const response = await axios.post("/api/community/subscribe", payload)
    return response.data
  } catch (err) {
    const error: AxiosError<KnownError> = err as any
    if (!error.response) {
      throw err
    }

    if (error.response.status) {
      return rejectWithValue({
        status: error.response.status,
        message: error.response.data.message,
      })
    }
    return rejectWithValue(error.response.data)
  }
})

export const unsubscribeCommunity = createAsyncThunk<
  string,
  string,
  { rejectValue: KnownError }
>("community/unsubscribe/post", async (communityId, { rejectWithValue }) => {
  try {
    const payload: { communityId: string } = {
      communityId,
    }
    const response = await axios.post("/api/community/unsubscribe", payload)
    return response.data
  } catch (err) {
    const error: AxiosError<KnownError> = err as any
    if (!error.response) {
      throw err
    }
    if (error.response.status) {
      return rejectWithValue({
        status: error.response.status,
        message: error.response.data.message,
      })
    }
    return rejectWithValue(error.response.data)
  }
})

const initialState = {
  isLoading: false,
  isSubscribed: null,
  memberCount: 0,
  communityId: "",
  creatorId: null,
  communityName: "",
  posts: [],
  error: null,
  status: null,
} as communityState

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setCommunity: (state, action: PayloadAction<setCommunityPayloadType>) => {
      state.memberCount = action.payload.memberCount
      state.isSubscribed = action.payload.isSubscribed
      state.communityId = action.payload.communityId
      // state.posts = action.payload.posts
      state.creatorId = action.payload.creatorId
      state.communityName = action.payload.communityName
    },
  },
  extraReducers: (builder) => {
    builder.addCase(subscribeCommunity.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSubscribed = true
      state.memberCount += 1
      state.status = 200
    })
    builder.addCase(subscribeCommunity.pending, (state) => {
      state.isLoading = true

      state.error = null
    })
    builder.addCase(subscribeCommunity.rejected, (state, action) => {
      state.isLoading = false
      if (action.payload && action.payload.status) {
        state.status = action.payload.status
        state.error = action.payload.message
      } else {
        state.error = "Could not subscribe community. Please try again later."
        state.status = 500
      }
    })
    builder.addCase(unsubscribeCommunity.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSubscribed = false
      state.memberCount -= 1
      state.status = 200
    })
    builder.addCase(unsubscribeCommunity.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(unsubscribeCommunity.rejected, (state, action) => {
      state.isLoading = false
      if (action.payload && action.payload.status) {
        state.status = action.payload.status
        state.error = action.payload.message
      } else {
        state.error = "Could not unsubscribe community. Please try again later."
        state.status = 500
      }
    })
  },
})

export const { setCommunity } = communitySlice.actions

export default communitySlice.reducer
