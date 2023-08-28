const express = require('express')
// const validate = require('../../middlewares/validate')
const welcomeMessageController = require('../../controllers/welcomeMessage.controller')

const router = express.Router()

router.route('/').get(welcomeMessageController.getWelcomeMessage)

module.exports = router
