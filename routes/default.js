// routes/default.js
function index(_req, res) {
  res.send(JSON.stringify({
    message: 'Application is running'
  }))
}

export { index }
