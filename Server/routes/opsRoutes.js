const express = require('express');
const router = express.Router();
const { getMaintenanceLogs, createMaintenanceLog, getExpenses, createExpenseLog, getReportMetrics } = require('../controllers/opsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/maintenance').get(getMaintenanceLogs).post(createMaintenanceLog);
router.route('/expenses').get(getExpenses).post(createExpenseLog);
router.get('/reports', getReportMetrics);

module.exports = router;