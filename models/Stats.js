const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  totalCancelledJobs: { type: Number, default: 0 },
  // Add other statistics if needed
});

const Stats = mongoose.model('Stats', statsSchema);
module.exports = Stats;
