import api from '../../api/axios';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addVehicle, updateVehicleInList, removeVehicle } from "../vehicles/vehiclesSlice";

// fetch vehicles for a specific client
export const fetchVehicles = createAsyncThunk(
    "vehicles/fetchVehicles",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/clients/${clientId}/vehicles`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// create new vehicle for a specific client
export const createVehicle = createAsyncThunk(
    "vehicles/createVehicle",
    async ({ clientId, vehicleData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post(`/clients/${clientId}/vehicles`, vehicleData);
            dispatch(addVehicle({ clientId, vehicle: response.data })); // Dispatching the regular reducer action
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// update vehicle details
export const updateVehicle = createAsyncThunk(
    "vehicles/updateVehicle",
    async ({ clientId, vehicleId, updatedData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.put(
                `/clients/${clientId}/vehicles/${vehicleId}`,
                updatedData
            );

            dispatch(updateVehicleInList({ clientId, vehicleId, updatedVehicle: response.data }))
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// delete a vehicle
export const deleteVehicle = createAsyncThunk(
    "vehicles/deleteVehicle",
    async ({ clientId, vehicleId }, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/clients/${clientId}/vehicles/${vehicleId}`);
            dispatch(removeVehicle({ clientId, vehicleId }));
            return vehicleId; // Return the deleted vehicleId
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// add car wash history in specific car (with deduction of balance)
export const addWashHistory = createAsyncThunk(
  "vehicles/addWashHistory",
  async ({ clientId, vehicleId, historyData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/clients/${clientId}/vehicles/${vehicleId}/washHistory`, { historyData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);