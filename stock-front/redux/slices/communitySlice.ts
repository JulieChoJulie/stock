import { CreateCommunityPayload } from "@/lib/validators/community"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"

export type KnownError = {
  message: string
  description: string
  code: number | undefined
}

export interface communityState {
  createdCommunity: string
  loading: boolean
  isSubscription: boolean
  memberCount: number
  error: string | null
  status: number | null
}

export const postComunity = createAsyncThunk<
  string,
  string,
  { rejectValue: KnownError }
>("community/post", async (name, { rejectWithValue }) => {
  try {
    const payload: CreateCommunityPayload = {
      name,
    }
    const response = await axios.post("/api/community", payload)
    return response.data as string
  } catch (err) {
    const error: AxiosError<KnownError> = err as any
    if (!error.response) {
      throw err
    }
    if (error.response.status) {
      return rejectWithValue({
        code: error.response.status,
        description: error.response.statusText,
        message: "error",
      })
    }
    return rejectWithValue(error.response.data)
  }
})

const initialState = {
  createdCommunity: "",
  loading: false,
  error: null,
  status: null,
} as communityState

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postComunity.fulfilled, (state, action) => {
      state.loading = false
      state.createdCommunity = action.payload
      state.status = 200
    })
    builder.addCase(postComunity.pending, (state) => {
      state.loading = true
      state.createdCommunity = ""
      state.error = null
    })
    builder.addCase(postComunity.rejected, (state, action) => {
      console.log(action)
      state.loading = false
      if (action.payload && action.payload.code) {
        state.status = action.payload.code
        state.error = action.payload.description
      } else {
        state.error = action.error.message
        state.status = 500
      }
    })
  },
})

export default communitySlice.reducer
