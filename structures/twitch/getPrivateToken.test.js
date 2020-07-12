process.env.DEBUG = 'twitchd*'

const getPrivateToken = require('./getPrivateToken')

getPrivateToken()
  .then(result => console.log(result))
