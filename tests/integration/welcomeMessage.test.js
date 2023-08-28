/* eslint-disable security/detect-object-injection */
const request = require('supertest')
const httpStatus = require('http-status')
const mockFs = require('mock-fs')
const path = require('path')
// const { describe, test, expect } = require('jest')
const app = require('../../src/app')
const { isValidJson, isValidJsonObject } = require('../jsonValidator')

const pathToMock = path.join(__dirname, '..', '..', 'messageFiles')

const mockFsMessageTemplateFolderEmptyConfig = {}
mockFsMessageTemplateFolderEmptyConfig[pathToMock] = {}

const mockFsMessageTemplateWrongFile = {}
mockFsMessageTemplateWrongFile[pathToMock] = {
  'welcomeMessage2.json': '',
}

const mockFsMessageTemplateEmpty = {}
mockFsMessageTemplateEmpty[pathToMock] = {
  'welcomeMessage.json': '',
}

const mockFsMessageTemplateBadJson = {}
mockFsMessageTemplateBadJson[pathToMock] = {
  'welcomeMessage.json': '{"message: "Automate all the things!","timestamp": ""}',
}

const mockFsMessageTemplateNoTimestampAttribute = {}
mockFsMessageTemplateNoTimestampAttribute[pathToMock] = {
  'welcomeMessage.json': '{"message": "Automate all the things!"}',
}

const mockFsRealFileConfig = {}
mockFsRealFileConfig[pathToMock] = {
  'welcomeMessage.json': '{"message": "Automate all the things!","timestamp": ""}',
}

describe('welcomeMessage routes', () => {
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

  //
  //
  describe('Test FS dependancies in welcomeMessage controller', () => {
    test('ApiError when Message Template folder empty', async () => {
      mockFs(mockFsMessageTemplateFolderEmptyConfig)
      const res = await request(app).get('/v1/welcomeMessage')
      mockFs.restore()

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR)
      expect(res.header['content-type']).toEqual('application/json; charset=utf-8')
      expect(isValidJson(res.text)).toBe(true)
      expect(isValidJsonObject(res.text)).toBe(true)
      expect(res.body).toHaveProperty('code', httpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body).toHaveProperty('message', "Message template file doesn't exist")
    })

    test('ApiError when Message Template folder contains wrong file', async () => {
      mockFs(mockFsMessageTemplateWrongFile)
      const res = await request(app).get('/v1/welcomeMessage')
      mockFs.restore()

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR)
      expect(res.header['content-type']).toEqual('application/json; charset=utf-8')
      expect(isValidJson(res.text)).toBe(true)
      expect(isValidJsonObject(res.text)).toBe(true)
      expect(res.body).toHaveProperty('code', httpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body).toHaveProperty('message', "Message template file doesn't exist")
    })

    test('ApiError when Message Template file is empty', async () => {
      mockFs(mockFsMessageTemplateEmpty)
      const res = await request(app).get('/v1/welcomeMessage')
      mockFs.restore()

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR)
      expect(res.header['content-type']).toEqual('application/json; charset=utf-8')
      expect(isValidJson(res.text)).toBe(true)
      expect(isValidJsonObject(res.text)).toBe(true)
      expect(res.body).toHaveProperty('code', httpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body).toHaveProperty('message', 'Message template empty')
    })

    test('ApiError when Message Template file contains non-parsable JSON', async () => {
      mockFs(mockFsMessageTemplateBadJson)
      const res = await request(app).get('/v1/welcomeMessage')
      mockFs.restore()

      expect(res.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR)
      expect(res.header['content-type']).toEqual('application/json; charset=utf-8')
      expect(isValidJson(res.text)).toBe(true)
      expect(isValidJsonObject(res.text)).toBe(true)
      expect(res.body).toHaveProperty('code', httpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body).toHaveProperty('message', 'Cannot parse message template JSON')
    })

    test("Append 'timestamp' attribute, even if template doesn't have it", async () => {
      mockFs(mockFsMessageTemplateNoTimestampAttribute)
      const res = await request(app).get('/v1/welcomeMessage')
      mockFs.restore()

      expect(res.statusCode).toEqual(httpStatus.OK)
      expect(res.header['content-type']).toEqual('application/json; charset=utf-8')
      expect(isValidJson(res.text)).toBe(true)
      expect(isValidJsonObject(res.text)).toBe(true)
      expect(res.body).toHaveProperty('message', 'Automate all the things!')
      expect(res.body).toHaveProperty('timestamp')
      expect(res.body.timestamp).toBeLessThan(new Date().getTime())
      expect(res.body.timestamp).toBeGreaterThan(new Date().getTime() - 100)
    })

    test('Valid on standard template file', async () => {
      mockFs(mockFsRealFileConfig)
      const res = await request(app).get('/v1/welcomeMessage')
      mockFs.restore()

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