import express from "express";
import {
    getClientTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketById 
} from "../controllers/ticketController.js";
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


router.get("/client/:clientId", requireAuth, getClientTickets); // Get a client's all tickets
router.post("/client/:clientId", requireAuth, createTicket);     // Create a ticket for a client


router.get("/:ticketId", requireAuth, getTicketById);           //Get 1 ticket for client
router.put("/:ticketId", requireAuth, updateTicket);            // Update 1 ticket for client
router.delete("/:ticketId", requireAuth, deleteTicket);         // Delete 1 ticket for client

export default router;
