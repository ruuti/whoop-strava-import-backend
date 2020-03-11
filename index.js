const express = require('express'),
      helmet = require('helmet'),
      strava = require('./strava'),
      whoop = require('./whoop'),
      cors = require('cors'),
      app = express(),
      port = process.env.PORT || 3001

app.use(helmet())

app.use(express.json())

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://wsi.dot0x01.com'
  ]
}))

app.post('/strava/auth', (req, res) => {
  const { code } = req.body
  if(!code) return res.status(400).json({})
  strava.authStrava(code).then(data => {
    res.json({
      access_token: data.access_token
    })
  }).catch((errCode) => {
    res.status(errCode).json({})
  })
})

app.get('/whoop/hr', (req, res) => {
  const authorizationHeader = req.get('Authorization')
  const {start, end, step, user_id} = req.query
  if(!authorizationHeader) return res.status(401).json({})
  if(!start || !end || !step || !user_id) return res.status(400).json({})
  whoop.getHrMetrics(authorizationHeader, start, end, step, user_id).then(data => {
    res.json(data)
  }).catch((errCode) => {
    res.status(errCode).json({})
  })
})

app.get('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(port)
