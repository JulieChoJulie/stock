import { configureStore } from "@reduxjs/toolkit"
// import { communityApi } from "@/redux/services/community/communityApi"
import communityReducer from "@/redux/slices/communitySlice"

export const store = configureStore({
  reducer: {
    community: communityReducer,
    // [communityApi.reducerPath]: communityApi.reducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(communityApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
