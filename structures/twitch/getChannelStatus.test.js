process.env.DEBUG = 'twitchArc*'

const getChannelStatus = require('./getChannelStatus')

getChannelStatus({ clientID: 'kimne78kx3ncx6brgo4mv6wki5h1ko', username: 'fluentAroma' })
  .then(data => console.log(data))
