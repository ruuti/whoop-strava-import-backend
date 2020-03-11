const request = require('request')

const getHrMetrics = (authorizationHeader, start, end, step, user_id) => {
  return new Promise((resolve, reject) => {
    request.get({
      url:`https://api-7.whoop.com/users/${ user_id }/metrics/heart_rate?end=${ end }&start=${ start }&step=${ step }`,
      headers: {
        'Authorization': authorizationHeader
      }
    }, (err, response, body) => {
      if(err) return reject(500)
      if(response.statusCode !== 200) return reject(401)
      return resolve(
        JSON.parse(body)
      )
    })
  })
}

module.exports.getHrMetrics = getHrMetrics
