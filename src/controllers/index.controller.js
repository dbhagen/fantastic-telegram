// const httpStatus = require('http-status')
// const pick = require('pick')
// const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')

const getIndex = catchAsync(async (req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    console.info(`FROM: ${req.ip} GET: /, result: ${JSON.stringify({ message: 'Application is running' })}`)
  }
  res.send({ message: 'Application is running' })
})

module.exports = {
  getIndex,
}
