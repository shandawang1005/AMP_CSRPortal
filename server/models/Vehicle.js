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
  subscriptionStartDate: {
    type: Date,
    default: function () {
      return this.subscriptionType === 'monthly' ? new Date() : null;
    },
  },
  subscriptionEndDate: {
    type: Date,
    default: function () {
      if (this.subscriptionType === 'monthly') {
        const startDate = new Date();
        return new Date(startDate.setMonth(startDate.getMonth() + 1));  // Adds 1 month for monthly subscriptions
      }
      return null;
    },
  },
  subscriptionAmount: {
    type: Number,
    default: function () {
      return this.subscriptionType === 'monthly' ? 30 : null; // Set monthly cost (or whatever your cost is)
    }
  },
  washHistory: [
    {
      date: { type: Date, required: true },
      service: { type: String, required: true },
      price: { type: Number },  //if monthly payment, no need for price
    },
  ],
}, {
  timestamps: true,
});

export default mongoose.model('Vehicle', vehicleSchema);
