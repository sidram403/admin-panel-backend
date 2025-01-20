const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  startTime: { type: Object, required: true },
  endTime: { type: Object, required: true },
  duration: { type: Number, required: true },
  breakHours: { type: Number, default: 0 },
  breakType: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  rateType: { type: String, enum: ['Flat rate', 'Hourly'] },
  payRate: { type: Number, required: false },
  totalWage: { type: Number },
  vacancy: { type: Number, default: 0 },
  standbyVacancy: { type: Number, default: 0 },
});

const jobSchema = new mongoose.Schema({
  jobName: { type: String, required: true },
  location: { type: String, required: true },
  dates: [{ type: Date }],
  requirements: {
    jobScopeDescription: { type: String, required: true },
    jobRequirements: { type: String, required: true },
  },
  popularity: { type: Number, default: 0 },
  image: { type: String, default: '/static/Job.png' },
  salary: String,
  company: {
    name: { type: String, required: true },
    agreementEndDate: { type: Date },
  },
  shifts: [shiftSchema],
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' },
  outletId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outlet' }],
  applicants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      applicationDate: { type: Date, default: Date.now },
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Withdrawn'], default: 'Pending' },
    },
  ],
  locationCoordinates: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
  },
  industry: { type: String },
  status: { type: String, enum: ['Ongoing', 'Pending', 'Cancelled', 'Completed', 'Deactivated'], default: 'Ongoing' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
