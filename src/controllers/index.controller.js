// const httpStatus = require('http-status')
// const pick = require('pick')
// const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')

const getIndex = catchAsync(async (_req, res) => {
  res.send({ message: 'Application is running' })
})

module.exports = {
  getIndex,
}
