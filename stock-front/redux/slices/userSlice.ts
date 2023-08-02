// import { createSlice } from "@reduxjs/toolkit"
// import type { PayloadAction } from "@reduxjs/toolkit"

// export interface usersState {
//   isLoggedIn: boolean
//   callbackUrl: string | null
// }

// const initialState = {
//   isLoggedIn: false,
//   callbackUrl: null,
// } as usersState

// const userSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {
//     increment: (state) => {
//       state.value += 2
//     },
//     setSearch: (state, action: PayloadAction<string>) => {
//       state.search = action.payload
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchUsers.fulfilled, (state, action) => {
//       state.entities.push(...action.payload)
//       state.loading = false
//     })
//     builder.addCase(fetchUsers.pending, (state) => {
//       state.loading = true
//     })
//   },
// })

// export const { increment } = userSlice.actions
// export default userSlice.reducer
