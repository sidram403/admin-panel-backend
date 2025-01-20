const express = require('express');
const {
  getOutlets,
  getOutletById,
  addOutlet,
  updateOutlet,
  deleteOutlet,
  addJobToOutlet
} = require('../controllers/outletController');

const router = express.Router();

router.get('/', getOutlets);
router.get('/:id', getOutletById);
router.post('/', addOutlet);
router.put('/:id', updateOutlet);
router.delete('/:id', deleteOutlet);
router.post('/:outletId/jobs/:jobId', addJobToOutlet);

module.exports = router;
