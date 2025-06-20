const express = require('express');
const router = express.Router();
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientMetrics,
  addClientNote
} = require('../controllers/clientController');
const { protect, authorize, checkClientAccess } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(authorize('manager', 'super_admin'), getClients)
  .post(authorize('manager', 'super_admin'), createClient);

router.route('/:id')
  .get(checkClientAccess, getClient)
  .put(checkClientAccess, authorize('manager', 'super_admin'), updateClient)
  .delete(checkClientAccess, authorize('manager', 'super_admin'), deleteClient);

router.route('/:id/metrics')
  .get(checkClientAccess, getClientMetrics);

router.route('/:id/notes')
  .post(checkClientAccess, authorize('manager', 'super_admin'), addClientNote);

module.exports = router;

