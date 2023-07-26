import { configureStore } from "@reduxjs/toolkit"
import communitySReducer from "@/slices/communitySlice"

export const store = configureStore({
  reducer: {
    community: communitySReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
