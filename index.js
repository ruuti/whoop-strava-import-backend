const express = require('express'),
      helmet = require('helmet'),
      strava = require('./strava'),
      whoop = require('./whoop'),
      cors = require('cors'),
      app = express(),
      rateLimit = require('express-rate-limit'),
      port = process.env.PORT || 3001

// Enable Helmet
app.use(helmet())

// Rate limiting
app.set('trust proxy', 1)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60 // limit each IP to 60 requests per windowMs
})
app.use(limiter)

app.use(express.json())

// Allow requests from specific origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://wsi.dot0x01.com'
  ]
}))
/**
 * Authenticate Strava user
 */
app.post('/strava/auth', (req, res) => {
  const { code } = req.body
  // Code not present, return 400
  if(!code) return res.status(400).json({})
  strava.authUserWithCode(code).then(data => {
    res.json({
      access_token: data.access_token
    })
  }).catch((errCode) => {
    res.status(errCode).json({})
  })
})
/**
 * Return heart rate data from Whoop for user
 */
app.get('/whoop/hr', (req, res) => {
  const authorizationHeader = req.get('Authorization')
  const {start, end, step, user_id} = req.query
  // No Authorization header present, return 401
  if(!authorizationHeader) return res.status(401).json({})
  // Not all query params present, return 400
  if(!start || !end || !step || !user_id) return res.status(400).json({})
  whoop.getUserHrMetrics(authorizationHeader, start, end, step, user_id).then(data => {
    res.json(data)
  }).catch((errCode) => {
    res.status(errCode).json({})
  })
})
/**
 * All other urls return 404
 */
app.get('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(port)
