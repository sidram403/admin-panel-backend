const Employer = require('../models/Employer');
const Job = require('../models/Job');
const Outlet = require('../models/Outlet');

// Get all employers
exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().populate('outlets');
    res.status(200).json(employers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employers.', details: err.message });
  }
};

// Get employer by ID
exports.getEmployerById = async (req, res) => {
  try {
    const { id } = req.params;
    const employer = await Employer.findById(id).populate('outlets');
    if (!employer) return res.status(404).json({ error: 'Employer not found.' });
    res.status(200).json(employer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employer.', details: err.message });
  }
};

// Create new employer
exports.createEmployer = async (req, res) => {
  try {
    const employer = new Employer(req.body);
    const savedEmployer = await employer.save();
    res.status(201).json(savedEmployer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create employer.', details: err.message });
  }
};

// Update employer
exports.updateEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployer = await Employer.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEmployer) return res.status(404).json({ error: 'Employer not found.' });
    res.status(200).json(updatedEmployer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employer.', details: err.message });
  }
};

// Delete employer
exports.deleteEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployer = await Employer.findByIdAndDelete(id);
    if (!deletedEmployer) return res.status(404).json({ error: 'Employer not found.' });
    res.status(200).json({ message: 'Employer deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employer.', details: err.message });
  }
};

// Fetch jobs posted by an employer
exports.getEmployerJobs = async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = await Job.find({ company: id });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employer jobs' });
  }
};

// Add a new job for an employer
exports.addEmployerJob = async (req, res) => {
  try {
    const { id } = req.params; // Employer ID
    const newJob = new Job({ ...req.body, company: id });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: 'Error adding job' });
  }
};

// Update job details
exports.updateEmployerJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error updating job' });
  }
};

// Delete a job
exports.deleteEmployerJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting job' });
  }
};

