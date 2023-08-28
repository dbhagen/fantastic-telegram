// file deepcode ignore HttpToHttps: Known unsecure connection
const http = require('http')

const options = { host: 'localhost', port: '3000', timeout: 2000, path: '/v1/' }
const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})
request.on('error', (err) => {
  console.log('ERROR', err)
  process.exit(1)
})
request.end()
