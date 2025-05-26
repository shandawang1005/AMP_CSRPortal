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

    // Status only
    if (req.body.status) {
      const updated = await Ticket.findByIdAndUpdate(ticketId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      return res.json(updated);
    }
    
    //Add comments
    if (req.body.text && req.body.author) {
      const updated = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          $push: {
            comments: {
              text: req.body.text,
              author: req.user._id,
              createdAt: new Date(),
            },
          },
        },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      return res.json(updated);
    }

    //Delete the ticket
    if (typeof req.body.deleteCommentAt === "number") {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });

      ticket.comments.splice(req.body.deleteCommentAt, 1);
      await ticket.save();
      return res.json(ticket);
    }

    // update comment itself
    if (
      typeof req.body.newText === "string"
    ) {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });

      ticket.comments[req.body.updateCommentAt].text = req.body.newText;
      await ticket.save();
      return res.json(ticket);
    }

    res.status(400).json({ message: "Invalid update payload." });
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ message: "Failed to update ticket" });
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
