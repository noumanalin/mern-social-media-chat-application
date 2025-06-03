import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

// interface Theme {
//   primaryColor: string
//   bgColor: string
// }

interface UIState {
  themeModalIsOpen: boolean
  editProfileModalOpen: boolean
  editPostModalOpen: boolean
  editPostId: string
  // theme: Theme
}

const initialState: UIState = {
  themeModalIsOpen: false,
  editProfileModalOpen: false,
  editPostModalOpen: false,
  editPostId: "",
  // theme: JSON.parse(localStorage.getItem("theme") || "null") || {
  //   primaryColor: "",
  //   bgColor: "",
  // },
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openThemeModal: (state) => {
      state.themeModalIsOpen = true
    },
    closeThemeModal: (state) => {
      state.themeModalIsOpen = false
    },
    // changeTheme: (state, action: PayloadAction<Theme>) => {
    //   state.theme = action.payload
    // },
    openEditProfileModal: (state) => {
      state.editProfileModalOpen = true
    },
    closeEditProfileModal: (state) => {
      state.editProfileModalOpen = false
    },
    openEditPostModal: (state, action: PayloadAction<string>) => {
      state.editPostModalOpen = true
      state.editPostId = action.payload
    },
    closeEditPostModal: (state) => {
      state.editPostModalOpen = false
    },
  },
})

export const uiSliceAction = uiSlice.actions
export default uiSlice.reducer
