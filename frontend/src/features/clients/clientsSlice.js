
import { createSlice } from "@reduxjs/toolkit";
import { fetchClients, searchClients } from "./clientsThunks";

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
            });
    },
});

export default clientsSlice.reducer;
