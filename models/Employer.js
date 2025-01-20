const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: false },
    contactPerson: { type: String, required: true },
    jobPosition: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    companyNumber: { type: String, required: true },
    address: { type: String, required: true },
    companyRegistrationNumber: { type: String, required: true },
    industry: { type: String, required: true },
    accountManager: { type: String, required: true },
    jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    outlets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outlet' }],
    agreementStartDate: { type: Date, required: true },
    agreementEndDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending', 'Terminated'], // Employer status
      default: 'Pending',
    },
    active: { type: Boolean, default: false },
    jobPostingLimit: { type: Number, default: 50 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employer', employerSchema);
