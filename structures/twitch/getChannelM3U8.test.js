process.env.DEBUG = 'twitchd*'

const getAccessToken = require('./getAccessToken')
const getChannelM3U8 = require('./getChannelM3U8')

const username = 'fluentAroma'

getAccessToken({ clientID: 'kimne78kx3ncx6brgo4mv6wki5h1ko', username })
  .then(data => data)
  .then(({ sig, token }) => getChannelM3U8({
    username,
    token,
    sig
  }))
  .then(m3u8 => console.log(m3u8))
