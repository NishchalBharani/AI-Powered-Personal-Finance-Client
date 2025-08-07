import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { BASE_URL, TRANSACTION_ROUTES } from '../constants/api';

const COOKIE_KEY = 'finance_token';
const HASH_SECRET = 'your-secret-key';

const getDecryptedToken = () => {
  const hashedToken = Cookies.get(COOKIE_KEY);
  if (!hashedToken) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(hashedToken, HASH_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8) || null;
  } catch (err) {
    return null;
  }
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async ({ category, startDate, endDate } = {}, { rejectWithValue }) => {
    const token = getDecryptedToken();
    if (!token) return rejectWithValue('Token missing or invalid');
    try {
      const params = {};
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await axios.get(`${BASE_URL}${TRANSACTION_ROUTES.CREATE}`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch transactions');
    }
  }
);

export const fetchInsights = createAsyncThunk(
  'transactions/insights',
  async (_, { rejectWithValue }) => {
    const token = getDecryptedToken();
    if (!token) return rejectWithValue('Token missing or invalid');
    try {
      const response = await axios.get(`${BASE_URL}${TRANSACTION_ROUTES.INSIGHTS}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch insights');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async ({ amount, category, description }, { rejectWithValue, dispatch }) => {
    const token = getDecryptedToken();
    if (!token) return rejectWithValue('Token missing or invalid');
    try {
      const response = await axios.post(
        `${BASE_URL}${TRANSACTION_ROUTES.CREATE}`,
        { amount, category, description },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      dispatch(fetchTransactions());
      dispatch(fetchInsights());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors || 'Failed to create transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue, dispatch }) => {
    const token = getDecryptedToken();
    if (!token) return rejectWithValue('Token missing or invalid');
    try {
      await axios.delete(`${BASE_URL}${TRANSACTION_ROUTES.CREATE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }
      );
      dispatch(fetchTransactions());
      dispatch(fetchInsights());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete transaction');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    insights: [],
    recommendations: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload.insights;
        state.recommendations = action.payload.recommendations;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default transactionSlice.reducer;