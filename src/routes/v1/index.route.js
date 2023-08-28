const express = require('express')
// const validate = require('../../middlewares/validate')
const indexController = require('../../controllers/index.controller')

const router = express.Router()

router.route('/').get(indexController.getIndex)

module.exports = router
