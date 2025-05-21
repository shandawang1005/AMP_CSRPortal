import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  licensePlate: { type: String, unique: true },
  color: { type: String },
  vin: { type: String, unique: true },
  subscriptionType: {
    type: String,
    enum: ['monthly', 'payPerWash'],
    default: 'payPerWash',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Vehicle', vehicleSchema);
