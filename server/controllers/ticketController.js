import Ticket from "../models/Ticket.js";
import Client from "../models/Client.js";


export const getClientTickets = async (req, res) => {
  try {
    const { clientId } = req.params;


    const clientExists = await Client.findById(clientId);
    if (!clientExists) {
      return res.status(404).json({ error: "Client not found" });
    }

    const tickets = await Ticket.find({ client: clientId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};


export const createTicket = async (req, res) => {
  try {
    const { clientId } = req.params;
    const ticketData = req.body;


    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }


    const newTicket = new Ticket({
      ...ticketData,
      client: clientId,
      createdAt: new Date(),
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};


export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const updates = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updates, { new: true });

    if (!updatedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ error: "Failed to update ticket" });
  }
};


export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};
