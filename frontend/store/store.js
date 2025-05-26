import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/auth/authSlice';
import clientsReducer from "../src/features/clients/clientsSlice"
import ticketsReducer from "../src/features/tickets/ticketSlice"
export const store = configureStore({
    reducer: {
        auth: authReducer,
        clients: clientsReducer,
        tickets: ticketsReducer,
    },
});
