
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../api/axios';


export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get(`/clients?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const searchClients = createAsyncThunk(
  "clients/searchClients",
  async ({ term, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get(`/clients/search`, {
        params: { term, page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);