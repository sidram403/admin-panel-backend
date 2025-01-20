const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema(
  {
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    locationCoordinates: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Closed'], // Outlet status
      default: 'Active',
    },
    activeJobs: { type: Number, default: 0 },
    contact: { type: String, required: true },
    operatingHours: { type: String, required: true },
    workerFeedback: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Outlet', outletSchema);
