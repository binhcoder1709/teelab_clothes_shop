import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  accessToken: Cookies.get('AT') || null,
  refreshToken: Cookies.get('RT') || null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      Cookies.set('AT', action.payload.accessToken);
      Cookies.set('RT', action.payload.refreshToken);
    },
    removeTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      Cookies.remove('AT');
      Cookies.remove('RT');
    },
    refreshAccessToken: (state, action) => {
      state.accessToken = action.payload;
      Cookies.set('AT', action.payload);
    },
  },
});

export const { setTokens, removeTokens, refreshAccessToken } = tokenSlice.actions;

export default tokenSlice.reducer;
