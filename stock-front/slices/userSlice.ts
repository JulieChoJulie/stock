import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export const fetchUsers = createAsyncThunk(
  "users/getAllUsers",
  async (thunkApi) => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users?_limit=5",
    )
    const data = await response.json()
    return data
  },
)

export interface usersState {
  entities: any[]
  loading: boolean
  value: number
  search: string
}

const initialState = {
  entities: [],
  loading: false,
  value: 10,
  search: "",
} as usersState

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 2
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.entities.push(...action.payload)
      state.loading = false
    })
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true
    })
  },
})

export const { increment } = userSlice.actions
export default userSlice.reducer
