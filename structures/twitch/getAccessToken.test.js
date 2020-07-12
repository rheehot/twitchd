process.env.DEBUG = 'twitchd*'

const getAccessToken = require('./getAccessToken')

getAccessToken({ clientID: 'kimne78kx3ncx6brgo4mv6wki5h1ko', username: 'fluentAroma' })
  .then(data => console.log(data))
