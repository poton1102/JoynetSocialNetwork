// const router = require('express').Router()
// const authCtrl = require('../controllers/authCtrl')
// const auth = require('../middleware/auth')
// const authAdmin = require('../middleware/authAdmin')

// router.post('/register', authCtrl.register)

// router.post('/activation', authCtrl.activateEmail)

// router.post('/login', authCtrl.login)

// router.post('/logout', authCtrl.logout)

// router.post('/refresh_token', authCtrl.generateAccessToken)

// router.post('/forgot', authCtrl.forgotPassword)

// router.post('/reset', auth, authCtrl.resetPassword)

// router.get('/infor', auth, authCtrl.getUserInfor)

// router.get('/all_infor', auth, authAdmin, authCtrl.getUsersAllInfor)

// // router.get('/logout', authCtrl.logout)

// // router.patch('/update', auth, authCtrl.updateUser)

// // router.patch('/update_role/:id', auth, authAdmin, authCtrl.updateUsersRole)

// // router.delete('/delete/:id', auth, authAdmin, authCtrl.deleteUser)


// // Social Login
// // router.post('/google_login', authCtrl.googleLogin)

// // router.post('/facebook_login', authCtrl.facebookLogin)





// module.exports = router

const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')

router.post('/register', authCtrl.register)

router.post('/login', authCtrl.login)

router.post('/logout', authCtrl.logout)

router.post('/refresh_token', authCtrl.generateAccessToken)


module.exports = router