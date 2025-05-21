import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';


export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);


export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/auth/me');
      return res.data.user;
    } catch (err) {
      return null; 
    }
  }
);


export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      return thunkAPI.rejectWithValue('Logout failed');
    }
  }
);
