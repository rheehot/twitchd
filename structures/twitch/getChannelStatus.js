const fetch = require('node-fetch')

const log = require('./log')

const getChannelStatus = async (opts = {}) => {
  opts.gqlURL = opts.gqlURL || 'https://gql.twitch.tv/gql'
  opts.username = opts.username || ''
  opts.clientID = opts.clientID || ''

  if (typeof opts.username !== 'string' || opts.username.length < 4) {
    return {
      error: 'The type of `username` should be string and should be longer than 4 character.'
    }
  }
  if (typeof opts.clientID !== 'string' || !opts.clientID) {
    return {
      error: 'The type of `clientID` should be string and its length should be 1 character at least.'
    }
  }

  log(`getting the status of the '${opts.username}' channel via Twitch GQL api`)

  const query = `
query {
  user(login: "${opts.username}") {
    id
    login
    displayName
    description
    createdAt
    roles {
      isPartner
    }
    stream {
      id
      title
      type
      viewersCount
      createdAt
      game {
        name
      }
    }
  }
}
`

  const response = await fetch(opts.gqlURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-ID': opts.clientID
    },
    body: JSON.stringify({ query })
  })
  const { data } = await response.json()

  log('got the metadata of user: ' + opts.username)

  if (!data.user) {
    log(`the user '${opts.username}' seems not exists on Twitch`)
  }
  if (data.user && !data.user.stream) {
    log(`the user '${opts.username}' seems not streaming live on Twitch`)
  }

  return {
    data
  }
}

module.exports = getChannelStatus
