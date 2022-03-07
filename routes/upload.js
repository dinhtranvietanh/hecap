const router = require('express').Router()
const uploadImg = require('../middleware/uploadImg')
const uploadCtrl = require('../controllers/uploadCtrl')
const auth = require('../middleware/auth')
router.post('/upload_avatar', uploadImg, auth, uploadCtrl.uploadAvatar)

module.exports = router