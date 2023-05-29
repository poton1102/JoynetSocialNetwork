const router = require('express').Router()
const adminCtrl = require('../controllers/adminCtrl')

//get list of reported posts
router.get('/reports', adminCtrl.getReports)

router.delete('/report/:id', adminCtrl.deleteReport);

router.delete('/reportOnly/:id', adminCtrl.deleteReportOnly);
module.exports = router