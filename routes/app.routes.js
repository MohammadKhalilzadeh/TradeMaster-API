const pushNotificationController = require('../controllers/push-notification.controllers')

const express = require('express')
const router = express.Router()

router.get('SendNotification', pushNotificationController.sendNotification)
router.post('SendNotification', pushNotificationController.sendNotificationToDevice)

module.exports = router;