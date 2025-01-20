const Outlet = require('../models/Outlet');
const Job = require('../models/Job');

// Fetch all outlets
exports.getOutlets = async (req, res) => {
  try {
    const { employerId } = req.query; // Optional filter by employer
    const filter = employerId ? { employer: employerId } : {};
    const outlets = await Outlet.find(filter).populate('employer').populate('activeJobs');
    res.status(200).json(outlets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching outlets', error });
  }
};

// Fetch outlet details by ID
exports.getOutletById = async (req, res) => {
  try {
    const { id } = req.params;
    const outlet = await Outlet.findById(id).populate('employer').populate({
      path: 'activeJobs',
      populate: { path: 'shifts' }
    });
    if (!outlet) return res.status(404).json({ message: 'Outlet not found' });
    res.status(200).json(outlet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching outlet details', error });
  }
};

// Add a new outlet
exports.addOutlet = async (req, res) => {
  try {
    const newOutlet = new Outlet(req.body);
    await newOutlet.save();
    res.status(201).json(newOutlet);
  } catch (error) {
    res.status(400).json({ message: 'Error adding outlet', error });
  }
};

// Update outlet details
exports.updateOutlet = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOutlet = await Outlet.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOutlet) return res.status(404).json({ message: 'Outlet not found' });
    res.status(200).json(updatedOutlet);
  } catch (error) {
    res.status(400).json({ message: 'Error updating outlet', error });
  }
};

// Delete an outlet
exports.deleteOutlet = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOutlet = await Outlet.findByIdAndDelete(id);
    if (!deletedOutlet) return res.status(404).json({ message: 'Outlet not found' });
    res.status(200).json({ message: 'Outlet deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting outlet', error });
  }
};

// Link a job to an outlet
exports.addJobToOutlet = async (req, res) => {
  try {
    const { outletId, jobId } = req.params;
    const outlet = await Outlet.findById(outletId);
    if (!outlet) return res.status(404).json({ message: 'Outlet not found' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    outlet.activeJobs.push(jobId);
    job.outlet = outletId;

    await outlet.save();
    await job.save();

    res.status(200).json({ message: 'Job added to outlet', outlet, job });
  } catch (error) {
    res.status(400).json({ message: 'Error linking job to outlet', error });
  }
};
