import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user-slice.ts'

// Create store
const store = configureStore({
  reducer: {
    user: userSlice,
  },
})

// Export store types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
