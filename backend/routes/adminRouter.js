const router = require('express').Router()
const adminCtrl = require('../controllers/adminCtrl')

//get list of reported posts
router.get('/reports', adminCtrl.getReports)

router.delete('/post/:id', adminCtrl.deletePost);
