const express = require('express')

const httpStatus = require('http-status')
const indexRoute = require('./index.route')
const welcomeMessageRoute = require('./welcomeMessage.route')
// eslint-disable-next-line no-unused-vars
const config = require('../../config/config')
const ApiError = require('../../utils/ApiError')

const router = express.Router()

const defaultRoutes = [
  {
    path: '/',
    route: indexRoute,
  },
  {
    path: '/welcomeMessage',
    route: welcomeMessageRoute,
  },
]

// TODO(Daniel Hagen): Add Dev Route Documentation
// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route)
//   })
// }

// Not found routes results in 404
router.use((_req, _res, next) => {
  console.info(router.stack)
  next(new ApiError(httpStatus.NOT_FOUND, `${_req.path} not found`))
})

module.exports = router
