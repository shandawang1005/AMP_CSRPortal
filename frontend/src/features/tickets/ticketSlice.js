import { createSlice } from "@reduxjs/toolkit";
import {
    fetchTickets,
    createTicket,
    addComment,
    updateTicketStatus,
    fetchTicketById,
    updateComment,
    deleteComment
} from "./ticketThunks";

const ticketSlice = createSlice({
    name: "tickets",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTickets(state) {
            state.list = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(createTicket.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })

            .addCase(addComment.fulfilled, (state, action) => {
                const updatedTicket = action.payload;
                const index = state.list.findIndex(t => t._id === updatedTicket._id);
                if (index !== -1) {
                    state.list[index] = updatedTicket;
                }
            })
            .addCase(updateTicketStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.list.findIndex(t => t._id === updated._id);
                if (index !== -1) {
                    state.list[index] = updated;
                }
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                const index = state.list.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                } else {
                    state.list.push(action.payload);
                }
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.list.findIndex((t) => t._id === updated._id);
                if (index !== -1) {
                    state.list[index] = updated;
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.list.findIndex((t) => t._id === updated._id);
                if (index !== -1) {
                    state.list[index] = updated;
                }
            });
    },
});

export const { clearTickets } = ticketSlice.actions;
export default ticketSlice.reducer;
