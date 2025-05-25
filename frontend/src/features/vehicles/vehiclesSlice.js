import { createSlice } from "@reduxjs/toolkit";
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle } from "../vehicles/vehiclesThunks"

const initialState = {
    vehicles: [],
    loading: false,
    error: null,
};

const vehiclesSlice = createSlice({
    name: "vehicles",
    initialState,
    reducers: {
        addVehicle: (state, action) => {
            // Add a new vehicle to the list
            state.vehicles.push(action.payload.vehicle);
        },
        updateVehicleInList: (state, action) => {
            // Update a vehicle in the list
            const index = state.vehicles.findIndex(vehicle => vehicle._id === action.payload.vehicleId);
            if (index !== -1) {
                state.vehicles[index] = action.payload.updatedVehicle;
            }
        },
        removeVehicle: (state, action) => {
            // Remove a vehicle from the list
            state.vehicles = state.vehicles.filter(vehicle => vehicle._id !== action.payload.vehicleId);
        },
    },
    extraReducers: (builder) => {
        builder
            //fetch
            .addCase(fetchVehicles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVehicles.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload;
            })
            .addCase(fetchVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //create
            .addCase(createVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles.push(action.payload);
            })
            .addCase(createVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //update
            .addCase(updateVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVehicle.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.vehicles.findIndex(vehicle => vehicle._id === action.payload._id);
                if (index !== -1) {
                    state.vehicles[index] = action.payload;
                }
            })
            .addCase(updateVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //delete
            .addCase(deleteVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = state.vehicles.filter(vehicle => vehicle._id !== action.payload);
            })
            .addCase(deleteVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addVehicle, updateVehicleInList, removeVehicle } = vehiclesSlice.actions;

export default vehiclesSlice.reducer;
