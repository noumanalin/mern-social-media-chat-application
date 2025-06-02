import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"


interface User {
  _id: string
  name: string
  email: string
  // Add more fields as per your user model
}

interface UserState {
  currentUser: User | null
  socket: any 
  onlineUsers: User[]
}

// Load initial currentUser from localStorage safely
const storedUser = localStorage.getItem("currentUser")
const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null

const initialState: UserState = {
  currentUser: parsedUser,
  socket: null,
  onlineUsers: [],
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload
    },
    setSocket: (state, action: PayloadAction<any>) => {
      state.socket = action.payload
    },
    setOnlineUsers: (state, action: PayloadAction<User[]>) => {
      state.onlineUsers = action.payload
    },
  },
})

export const userActions = userSlice.actions
export default userSlice.reducer
