// file deepcode ignore UseCsurfForExpress: currently not accepting requests, so not at risk.
// TODO(Daniel Hagen): Add CURF protection
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const { xss } = require('express-xss-sanitizer')
const compression = require('compression')
const cors = require('cors')
const httpStatus = require('http-status')
// eslint-disable-next-line no-unused-vars
const config = require('./config/config')
const routes = require('./routes/v1')
const { errorConverter, errorHandler } = require('./middlewares/error')
const ApiError = require('./utils/ApiError')

const app = express()

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(bodyParser.json({ limit: '1kb' }))
app.use(express.urlencoded({ extended: true, limit: '1kb' }))
app.use(xss())

// gzip compression
app.use(compression())

// enable cors
app.use(cors())
app.options('*', cors())

// limit repeated failed requests to auth endpoints
// TODO(Daniel Hagen): Add Rate Limiter
// if (config.env === 'production') {
//   app.use('/v1/auth', authLimiter);
// }

// v1 api routes
app.use('/v1', routes)

// Redirect base to v1
app.get('/', (_req, res) => res.redirect(308, '/v1/'))

// Not found routes results in 404
app.use((_req, _res, next) => {
  // console.info(app._router.stack)
  next(new ApiError(httpStatus.NOT_FOUND, `${_req.path} not found`))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

module.exports = app
