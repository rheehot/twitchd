const log = require('./log')

const createIntervalTask = (opts = {}) => {
  if (typeof opts.function !== 'function') {
    throw new Error('The type of `function` option should be function.')
  }
  if (isNaN(opts.time)) {
    throw new Error('The type of `time` option should be number.')
  }

  opts.function()

  setInterval(() => {
    try {
      opts.function()
    } catch (error) {
      log(error)
    }
  }, opts.time)
}

module.exports = createIntervalTask
