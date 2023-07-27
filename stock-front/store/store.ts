import { configureStore } from "@reduxjs/toolkit"
import communitySReducer from "@/redux/slices/communitySlice"
import { communityApi } from "@/redux/services/community/communityApi"

export const store = configureStore({
  reducer: {
    community: communitySReducer,
    [communityApi.reducerPath]: communityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(communityApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
