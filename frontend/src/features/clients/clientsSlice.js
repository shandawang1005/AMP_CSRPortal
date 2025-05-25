
import { createSlice } from "@reduxjs/toolkit";
import { fetchClients, searchClients, fetchClientById } from "./clientsThunks";

const initialState = {
    clients: [],
    loading: false,
    error: null,
    pagination: {}
};

const clientsSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetch
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
                state.pagination = action.payload.pagination
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load recent clients";
            })

            // search
            .addCase(searchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
                state.pagination = action.payload.pagination;
            })
            .addCase(searchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchClientById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClientById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedClient = action.payload; 
            })
            .addCase(fetchClientById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default clientsSlice.reducer;
