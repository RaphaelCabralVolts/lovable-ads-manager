// Placeholder routes - will be implemented in next phases
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

// Placeholder endpoints
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Reports endpoint - to be implemented',
    data: []
  });
});

module.exports = router;

