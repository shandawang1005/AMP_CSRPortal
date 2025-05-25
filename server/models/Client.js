
import mongoose from 'mongoose';
import '../models/Vehicle.js';
import '../models/Ticket.js';
const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String },
  address: { type: String },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ['active', 'overdue'],
    default: 'active',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
clientSchema.virtual('tickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'client',
  justOne: false,        //one to many
});
clientSchema.virtual('vehicles', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'client',
  justOne: false,
});




export default mongoose.model('Client', clientSchema);
