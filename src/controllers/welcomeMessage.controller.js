// file deepcode ignore NoRateLimitingForExpensiveWebOperation: Rate limiting set at application level

const fs = require('fs')
const path = require('path')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const ApiError = require('../utils/ApiError')

const getWelcomeMessage = catchAsync(async (req, res) => {
  const pathToFile = path.join(__dirname, '..', '..', 'messageFiles', 'welcomeMessage.json')
  if (fs.existsSync(pathToFile)) {
    const data = fs.readFileSync(pathToFile, 'utf8')
    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Message template empty in ${pathToFile}`)
    }
    let returnData = {}
    try {
      returnData = JSON.parse(data)
    } catch (_error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot parse message template JSON in ${pathToFile}`)
    }
    returnData.timestamp = new Date().getTime()
    if (process.env.NODE_ENV !== 'test') {
      console.info(`FROM: ${req.ip} GET: /welcomeMessage, result: ${JSON.stringify(returnData)}`)
    }
    res.send(returnData)
  } else {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Message template file doesn't exist @ ${pathToFile}`)
  }
})

module.exports = { getWelcomeMessage }
