const request = require('supertest')
const httpStatus = require('http-status')
const app = require('../../src/app')
const { isValidJson, isValidJsonObject } = require('../jsonValidator')

describe('Index routes', () => {
  describe('GET /', () => {
    test('/ should return 308 redirect to /v1/', async () => {
      const res = await request(app).get('/')

      expect(res.statusCode).toEqual(httpStatus.PERMANENT_REDIRECT)
      expect(res.header.location).toEqual('/v1/')
    })
  })

  describe('GET /v1/', () => {
    test('Should get JSON message saying application running', async () => {
      const res = await request(app).get('/v1/')

      expect(res.statusCode).toEqual(httpStatus.OK)
      expect(res.header['content-type']).toEqual('application/json; charset=utf-8')
      expect(res.header['content-type']).toEqual('application/json; charset=utf-8')
      expect(isValidJson(res.text)).toBe(true)
      expect(isValidJsonObject(res.text)).toBe(true)
      expect(res.body).toHaveProperty('message', 'Application is running')
    })
  })
})
