const { chromium } = require('playwright')

const log = require('./log')

const getPrivateToken = (opts = {}) => {
  return new Promise((resolve, reject) => {
    opts.domain = opts.domain || 'twitch.tv'

    // NOTE: Refer browser object here to use after the promise.
    let browser

    log('getting latest private token from twitch api')

    chromium.launch()
      .then(browserInstance => {
        browser = browserInstance

        return browserInstance.newContext()
      })
      .then(context => context.newPage())
      .then(page => {
        page
          .on('request', request => {
            // NOTE: `\w{4,25}` is the format of Twitch username.
            const accessTokenURLPattern = /\/api\/channels\/\w{4,25}\/access_token/i
            const url = request.url()

            if (accessTokenURLPattern.test(url)) {
              const headers = request.headers()
              const headerNames = Object.keys(headers)

              for (let i = 0, l = headerNames.length; i < l; i++) {
                const headerName = (headerNames[i] || '').toLowerCase()

                // NOTE: If the request includes the header whose name is `client-id`, catch it.
                if (headerName && headerName === 'client-id') {
                  const clientID = headers[headerName]

                  log('got private token from twitch api request: ' + clientID)

                  browser
                    .close()
                    .then(() => resolve({ clientID }))
                }
              }
            }
          })
          .on('load', () => resolve({
            error: 'There was no meaningful request to get private API token!'
          }))

        page.goto('http://' + opts.domain)
      })
  })
}

module.exports = getPrivateToken
