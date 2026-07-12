const express = require('express');
const router = express.Router();
const { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getTrips).post(createTrip);
router.put('/:id/dispatch', dispatchTrip);
router.put('/:id/complete', completeTrip);
router.put('/:id/cancel', cancelTrip);

module.exports = router;