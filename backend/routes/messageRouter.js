const router = require('express').Router()
const messageCtrl = require('../controllers/messageCtrl')
const auth = require('../middleware/auth')

router.post('/message', auth, messageCtrl.createMessage)

router.post('/chat', auth, messageCtrl.accessChat)

router.post('/chat/group', auth, messageCtrl.createGroupChat)

router.route("/chat/rename").patch(messageCtrl.renameGroup)

router.route("/chat/groupremove").patch(messageCtrl.removeFromGroup)

router.route("/chat/groupadd").patch(messageCtrl.addToGroup)

router.get('/conversations', auth, messageCtrl.getConversations)

router.get('/message/:id', auth, messageCtrl.getMessages)

router.delete('/message/:id', auth, messageCtrl.deleteMessages)

router.delete('/conversation/:id', auth, messageCtrl.deleteConversation)


module.exports = router