import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    nickname: '',
  },
  reducers: {
    // toggleLoggedIn: (state) => (state.isLoggedIn = !state.isLoggedIn),
    toggleLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setNickname: (state, action) => {
      state.nickname = action.payload;
    },
  },
});

export const { toggleLoggedIn, setNickname } = userSlice.actions;
export default userSlice.reducer;
