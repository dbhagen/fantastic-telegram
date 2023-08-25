/* The code is importing various modules and libraries required for the application: */
require('dotenv').config()
require('log-timestamp')
const express = require('express')
const helmet = require('helmet')
const rateLimitFlexible = require('rate-limiter-flexible')
const fs = require('fs')
const path = require('path')

// deepcode ignore UseCsurfForExpress: Not using sessions
const app = express()

/* `app.use(helmet())` is a middleware function that adds various HTTP headers to enhance the security
of the application. Helmet helps protect the application from common security vulnerabilities by
setting appropriate headers such as Content Security Policy (CSP), Strict-Transport-Security (HSTS),
X-Frame-Options, X-XSS-Protection, and more. These headers help prevent attacks like cross-site
scripting (XSS), clickjacking, and other security threats. */
app.use(helmet())

/* This code is checking the value of the environment variable `DEBUG`. If the value is equal to the
string `'true'`, then the `DEBUG` constant is set to `true`, enabling debug console output. Otherwise, it is set to `false`. */
const DEBUG = process.env.DEBUG === 'true' || false
if (DEBUG) {
  console.log('DEBUG mode is enabled')
}

/* The code is defining several constants related to rate limiting and handling too many requests. */
const MAX_REQUEST_WINDOW_MS = process.env.MAX_REQUEST_WINDOW_MS || 60 * 1000 // Default: 1 minute
const MAX_REQUEST_LIMIT = process.env.MAX_REQUEST_LIMIT || 5 // Default: 5 requests
const TOO_MANY_REQUESTS_STATUS_CODE = process.env.TOO_MANY_REQUESTS_STATUS_CODE || 429
const TOO_MANY_REQUESTS_MESSAGE = process.env.TOO_MANY_REQUESTS_MESSAGE || 'Too many requests from this IP, please try again later'
if (DEBUG) {
  console.log('Rate limit window (ms): ' + MAX_REQUEST_WINDOW_MS)
  console.log('Rate limit max: ' + MAX_REQUEST_LIMIT)
}
/* The code `const rateLimiter = new rateLimitFlexible.RateLimiterMemory({ duration:
MAX_REQUEST_WINDOW_MS, points: MAX_REQUEST_LIMIT })` is creating a rate limiter object using the
`RateLimiterMemory` class from the `rate-limiter-flexible` library. */
const rateLimiter = new rateLimitFlexible.RateLimiterMemory({
  duration: MAX_REQUEST_WINDOW_MS,
  points: MAX_REQUEST_LIMIT
})
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then((rateLimiterRes) => {
      res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000)
      res.setHeader('X-RateLimit-Limit', MAX_REQUEST_LIMIT)
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints)
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString())
      next()
    })
    .catch(() => {
      res
        .status(TOO_MANY_REQUESTS_STATUS_CODE)
        .setHeader('content-type', 'application/json,charset=utf-8')
        .setHeader('X-RateLimit-Limit', MAX_REQUEST_LIMIT)
        .setHeader('X-RateLimit-Remaining', 0)
        .setHeader('X-RateLimit-Reset', new Date(Date.now() + MAX_REQUEST_WINDOW_MS).toISOString())
        .setHeader('Retry-After', MAX_REQUEST_WINDOW_MS / 1000)
        .send(
          JSON.stringify({
            message: TOO_MANY_REQUESTS_MESSAGE,
            status: TOO_MANY_REQUESTS_STATUS_CODE
          })
        )
    })
}
app.use(rateLimiterMiddleware)

/* This is defining a route for the GET request to the '/welcomeMessage' endpoint.
When a GET request is made to this endpoint, the callback function will load a
predefined file located in `/messageFiles/welcomeMessage.json`, modifying the `timestamp`
attribute with a current timestamp. Finally, it will respond with the contents */
app.get('/welcomeMessage', function (req, res) {
  fs.readFile(path.join(__dirname, 'messageFiles', 'welcomeMessage.json'), 'utf8', function (_err, data) {
    const returnData = JSON.parse(data)
    returnData.timestamp = new Date().getTime()
    const JSONReturnData = JSON.stringify(returnData)
    if (DEBUG) {
      console.log('FROM: ' + req.ip + ' GET: /welcomeMessage, result: ' + JSONReturnData)
    }
    res.end(JSONReturnData)
  })
})

/* This code is defining the port on which the application will listen for incoming requests. */
const APP_PORT = process.env.APP_PORT || 8081
/* The code `const server = app.listen(APP_PORT, function () { ... })` is starting the server and
making it listen for incoming requests on the specified port (`APP_PORT`). */
const server = app.listen(APP_PORT, function () {
  const host = server.address().address
  const port = server.address().port
  if (DEBUG) {
    console.log('Example app listening at http://%s:%s', host, port)
  }
})
