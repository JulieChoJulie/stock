import { configureStore } from "@reduxjs/toolkit"
import communityReducer from "@/redux/slices/communitySlice"
import { postApi } from "@/redux/services/post/postApi"

export const store = configureStore({
  reducer: {
    community: communityReducer,
    [postApi.reducerPath]: postApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
