import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchTickets = createAsyncThunk(
    "tickets/fetchTickets", async (clientId) => {
        const res = await api.get(`/tickets/client/${clientId}`);
        return res.data;
    });

export const createTicket = createAsyncThunk(
    "tickets/createTicket", async ({ clientId, subject, description, author }) => {
        const res = await api.post(`/tickets/client/${clientId}`, { subject, description, author });
        return res.data;
    });

export const fetchTicketById = createAsyncThunk(
    "tickets/fetchTicketById",
    async (ticketId) => {
        const res = await api.get(`/tickets/${ticketId}`);
        return res.data;
    }
);


export const addComment = createAsyncThunk(
    "tickets/addComment", async ({ ticketId, text, author }) => {
        const res = await api.put(`/tickets/${ticketId}`, { text, author });
        return res.data;
    });


export const updateTicketStatus = createAsyncThunk(
    "tickets/updateTicketStatus",
    async ({ ticketId, status }) => {
        const res = await api.put(`/tickets/${ticketId}`, { status });
        return res.data;
    }
);

export const deleteComment = createAsyncThunk(
    "tickets/deleteComment",
    async ({ ticketId, commentIndex }) => {
        const res = await api.put(`/tickets/${ticketId}`, {
            deleteCommentAt: commentIndex,
        });
        return res.data;
    }
);

export const updateComment = createAsyncThunk(
    "tickets/updateComment",
    async ({ ticketId, commentIndex, newText }, thunkAPI) => {
        const res = await api.put(`/tickets/${ticketId}`, {
            updateCommentAt: commentIndex,
            newText,
        });
        return res.data;
    }
);
