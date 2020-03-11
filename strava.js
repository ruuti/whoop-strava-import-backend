const request = require('request')

const authStrava = code => {
  const formData = {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code'
  }
  return new Promise((resolve, reject) => {
    request.post('https://www.strava.com/oauth/token', {form: formData}, (err, response, body) => {
      if(err) return reject(500)
      if(response.statusCode !== 200) return reject(401)
      return resolve(
        JSON.parse(body)
      )
    })
  })
}

module.exports.authStrava = authStrava
