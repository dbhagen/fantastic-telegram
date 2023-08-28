// file deepcode ignore NoRateLimitingForExpensiveWebOperation: Rate limiting set at application level

const fs = require('fs')
const path = require('path')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const ApiError = require('../utils/ApiError')

const getWelcomeMessage = catchAsync(async (req, res) => {
  const pathToFile = path.join(__dirname, '..', '..', 'messageFiles', 'welcomeMessage.json')
  console.info('filepath', pathToFile)
  if (fs.existsSync(pathToFile)) {
    const data = fs.readFileSync(pathToFile, 'utf8')
    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Message template empty')
    }
    let returnData = {}
    try {
      returnData = JSON.parse(data)
    } catch (_error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot parse message template JSON')
    }
    returnData.timestamp = new Date().getTime()
    console.info(`FROM: ${req.ip} GET: /welcomeMessage, result: ${JSON.stringify(returnData)}`)
    res.send(returnData)
  } else {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Message template file doesn't exist")
  }
})

module.exports = { getWelcomeMessage }
