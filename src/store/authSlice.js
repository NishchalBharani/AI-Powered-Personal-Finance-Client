import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { BASE_URL, AUTH_ROUTES } from '../constants/api';

const COOKIE_KEY = 'finance_token';
const HASH_SECRET = 'your-secret-key';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}${AUTH_ROUTES.LOGIN}`, { email, password });
    const token = response.data.token;
    const hashedToken = CryptoJS.AES.encrypt(token, HASH_SECRET).toString();
    Cookies.set(COOKIE_KEY, hashedToken, { expires: 1, secure: true, sameSite: 'Strict' });
    return token;
  } catch (err) {
    return rejectWithValue(err.response.data.error || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}${AUTH_ROUTES.REGISTER}`, { email, password });
    return response.data.message;
  } catch (err) {
    return rejectWithValue(err.response.data.error || 'Registration failed');
  }
});

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const hashedToken = Cookies.get(COOKIE_KEY);
    if (!hashedToken) return rejectWithValue('No token found');
    const bytes = CryptoJS.AES.decrypt(hashedToken, HASH_SECRET);
    const token = bytes.toString(CryptoJS.enc.Utf8);
    if (!token) return rejectWithValue('Invalid token');
    return token;
  } catch (err) {
    return rejectWithValue('Session restore failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, error: null, loading: false },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.error = null;
      Cookies.remove(COOKIE_KEY);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;