process.env.DEBUG = 'twitchArc*'

const getPrivateToken = require('./getPrivateToken')

getPrivateToken()
  .then(result => console.log(result))
