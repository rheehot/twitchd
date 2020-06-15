const { TwitchArc } = require('./handlers')
const config = require('./config')
const log = require('./log')
const pkg = require('./package')

module.exports = (async () => {
  log(`starting ${pkg.name}@v${pkg.version} at ${Date.now()}`)

  new TwitchArc(config)
    .initialize()
})()
