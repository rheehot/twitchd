const fetch = require('node-fetch')

const { createUrlencodeQuery } = require('../utils')
const log = require('./log')

const getChannelM3U8 = async (opts = {}) => {
  opts.apiURL = opts.apiURL || 'https://usher.ttvnw.net'
  opts.username = opts.username || ''
  opts.token = opts.token || ''
  opts.sig = opts.sig || ''
  opts.clientOpts = opts.clientOpts || {
    allow_source: true,
    fast_bread: false,
    player_backend: 'mediaplayer',
    playlist_include_framerate: true,
    reassignments_supported: true,
    sig: opts.sig,
    token: opts.token,
    supported_codecs: 'avc1',
    cdm: 'wv'
  }

  if (typeof opts.apiURL !== 'string' || !opts.apiURL.length) {
    return {
      error: 'The type of `domain` should be string and should be at least 1 character.'
    }
  }
  if (typeof opts.username !== 'string' || opts.username.length < 4) {
    return {
      error: 'The type of `username` should be string and should be longer than 4 character.'
    }
  }
  if (typeof opts.token !== 'string') {
    return {
      error: 'The type of `token` should be string.'
    }
  }
  if (typeof opts.sig !== 'string') {
    return {
      error: 'The type of `sig` should be string.'
    }
  }
  if (typeof opts.clientOpts !== 'object') {
    return {
      error: 'The type of `clientOpts` should be object.'
    }
  }

  log(`getting the m3u8 playlist from channel: ${opts.username}`)

  const response = await fetch(`${opts.apiURL}/api/channel/hls/${opts.username}.m3u8?${createUrlencodeQuery(opts.clientOpts)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/x-mpegURL, application/vnd.apple.mpegurl, application/json, text/plain',
      'Content-Type': 'application/json'
    }
  })
  const data = await response.text()

  log('got the m3u8 playlist from channel: ' + opts.username)

  return data
}

module.exports = getChannelM3U8
