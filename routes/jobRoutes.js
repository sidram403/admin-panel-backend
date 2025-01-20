const express = require('express');
const { createJob, getJobs, getJobById, updateJob, getFilters, getDashboardMetrics, viewJob, modifyJob, duplicateJob, deactivateJob, cancelJob, getJobsByDate, applyForJob, getUserJobs, getOngoingJobs, getCompletedJobs, getCancelledJobs, searchJobs, getAppliedJobs   } = require('../controllers/jobController');
const {authMiddleware}  = require('../middlewares/auth');

const router = express.Router();

router.post('/', authMiddleware, createJob);
router.get('/',authMiddleware,  getJobs);
router.get('/search', searchJobs);
router.get('/applied',authMiddleware , getAppliedJobs);
router.get('/dates', getJobsByDate);
router.get('/metrics', getDashboardMetrics);
router.get('/:id',authMiddleware, getJobById);
router.put('/:id',authMiddleware, updateJob);
router.get('/filter', getFilters);
router.get('/:jobId/view', viewJob);
router.put('/:jobId/modify', modifyJob);
router.post('/:jobId/duplicate', duplicateJob);
router.put('/:jobId/deactivate', deactivateJob);
router.delete('/:jobId', cancelJob);
router.post('/:jobId/apply',authMiddleware, applyForJob);
router.get('/user-jobs',authMiddleware, getUserJobs);
router.get('/ongoing', getOngoingJobs);
router.get('/completed', getCompletedJobs);
router.get('/cancelled', getCancelledJobs);

module.exports = router;
