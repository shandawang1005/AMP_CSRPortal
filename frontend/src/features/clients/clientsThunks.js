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
      const response = await api.get("/clients/search", {
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

export const fetchClientById = createAsyncThunk(
  "clients/fetchClientById",
  async (clientId, thunkAPI) => {
    try {

      const res = await api.get(`/clients/${clientId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch client detail"
      );
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const res = await api.put(`/clients/${id}`, updateData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to update client"
      );
    }
  }
);



export const refillBalance = createAsyncThunk(
  "clients/refillBalance",
  async ({ clientId, amount }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/clients/${clientId}/refill`, { amount });
      return response.data; // Return updated client data (including balance)
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// deduct client balance (per car wash)
export const updateClientBalance = createAsyncThunk(
  "clients/updateClientBalance",
  async ({ clientId, amount }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/clients/${ clientId }/deduct`, { amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
