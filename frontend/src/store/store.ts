import { configureStore } from '@reduxjs/toolkit'
import uiSlice from './ui-slice.ts'
import userSlice from './user-slice.ts'

// Create store
const store = configureStore({
  reducer: {
    ui: uiSlice,
    user: userSlice,
  },
})

// Export store types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
