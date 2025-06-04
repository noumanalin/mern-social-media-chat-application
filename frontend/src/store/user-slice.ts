import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoginHistory {
  time: string;
  os: string;
  device: string;
  browser: string;
}

interface User {
  _id: string;
  userName: string;
  email: string;
  profilePhoto?: string;
  bio?: string;
  followers?: string[];
  followings?: string[];
  bookmarks?: string[];
  posts?: string[];
  registeredAt?: string;
  lastLogin?: LoginHistory;
  loginHistory?: LoginHistory[];
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UserState {
  currentUser: User | null;
  token: string | null;
  socket: any;
  onlineUsers: User[];
}

// Helper function to safely parse localStorage items
const safeParse = (item: string | null) => {
  try {
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to parse stored data", error);
    return null;
  }
};

// Load initial state from localStorage
const initialState: UserState = {
  currentUser: safeParse(localStorage.getItem("currentUser")),
  token: localStorage.getItem("token"),
  socket: null,
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      
      // Store in localStorage
      localStorage.setItem("currentUser", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.socket = null;
      
      // Clear localStorage
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    },
    setSocket: (state, action: PayloadAction<any>) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<User[]>) => {
      state.onlineUsers = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      }
    },
  },
});

export const { loginSuccess, logout, setSocket, setOnlineUsers, updateUser } = userSlice.actions;
export default userSlice.reducer;