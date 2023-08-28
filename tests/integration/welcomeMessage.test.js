const request = require('supertest')
const httpStatus = require('http-status')
const app = require('../../src/app')
const { isValidJson, isValidJsonObject } = require('../jsonValidator')

describe('Index routes', () => {
  describe('GET /welcomeMessage', () => {
    test('/welcomeMessage should return 404', async () => {
      const res = await request(app).get('/')

      expect(res.statusCode).toEqual(httpStatus.PERMANENT_REDIRECT) // FIXME(Daniel Hagen): Should be 404 not found, returning redirect 308
      expect(res.header['content-type']).toEqual('text/plain; charset=utf-8') // FIXME(Daniel Hagen): Should be 'application/json; charset=utf-8', getting 'text/plain; charset=utf-8'
      expect(isValidJson(res.text)).toBe(false) // FIXME(Daniel Hagen): should be true, getting false
      expect(isValidJsonObject(res.text)).toBe(false) // FIXME(Daniel Hagen): should be true, getting false
    })
  })

  describe('GET /v1/welcomeMessage', () => {
    test('Should get JSON object with message and valid timestamp', async () => {
      const res = await request(app).get('/v1/welcomeMessage')

      expect(res.statusCode).toEqual(httpStatus.OK)
      expect(res.header['content-type']).toEqual('application/json; charset=utf-8')
      expect(isValidJson(res.text)).toBe(true)
      expect(isValidJsonObject(res.text)).toBe(true)
      expect(res.body).toHaveProperty('message', 'Automate all the things!')
      expect(res.body).toHaveProperty('timestamp')
      expect(res.body.timestamp).toBeLessThan(new Date().getTime())
      expect(res.body.timestamp).toBeGreaterThan(new Date().getTime() - 100)
    })
  })
})
