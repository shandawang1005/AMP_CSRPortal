// models/Ticket.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    subject: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [
        {
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
}, {
    timestamps: true,
});

export default mongoose.model('Ticket', ticketSchema);
