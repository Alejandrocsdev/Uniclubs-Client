import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      if (action.payload.token) {
        state.token = action.payload.token
      }
      if (action.payload.user) {
        state.user = action.payload.user
      }
    },
    clearCredentials(state) {
      state.token = null
      state.user = null
    }
  }
})

export const { setCredentials, clearCredentials } = authSlice.actions

export default authSlice.reducer
