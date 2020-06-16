const actions = require('../actions')
const {
  database,
  twitch,
  utils,
  createLogger
} = require('../structures')

const log = createLogger('handler')

module.exports = class TwitchArc {
  constructor (opts = {}) {
    this.opts = opts
    this.token = ''
  }

  async initialize () {
    await database.createTables()

    utils.createIntervalTask({
      function: () => this.updateToken(),
      time: this.opts.arc.intervals.token
    })

    for (let i = 0, l = this.opts.arc.users.length; i < l; i++) {
      const username = this.opts.arc.users[i]

      if (username) {
        setTimeout(() => utils.createIntervalTask({
          function: () => this.updateUser(username),
          time: this.opts.arc.intervals.status
        }), i * 250)
      }
    }
  }

  async updateToken () {
    const { clientID, error } = await twitch.getPrivateToken()

    if (error) {
      throw new Error(error)
    }
    if (!clientID) {
      throw new Error('Could not get the private token from Twitch web app.')
    }

    // NOTE: Record this event into the database:
    await database.knex('events')
      .insert({
        action: actions.TOKEN_UPDATE,
        from: 'system',
        ref: clientID,
        createdAt: new Date()
      })

    this.token = clientID
  }

  async updateUser (username) {
    if (!this.token) {
      return
    }

    log('updating user: ' + username)

    const { data } = await twitch.getChannelStatus({
      clientID: this.token,
      username
    })

    if (data.user) {
      const [user] = await database.knex('users')
        .select('*')
        .where({ username })
        .limit(1)

      let method = 'insert'

      // NOTE: Update the row instead of insert if user exists.
      if (user) {
        method = 'update'
      }

      await database.knex('users')[method]({
        username,
        userId: data.user.id,
        displayName: data.user.displayName,
        description: data.user.description,
        offlineImageURL: data.user.offlineImageURL,
        profileImageURL: data.user.profileImageURL,
        profileViewCount: data.user.profileViewCount,
        hasPrime: data.user.hasPrime,
        hasTurbo: data.user.hasTurbo,
        isPartner: data.user.roles.isPartner,
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt
      })
        .where({ userId: data.user.id })
      await database.knex('events')
        .insert({
          action: actions.USER_UPDATE,
          from: 'system',
          ref: data.user.id,
          createdAt: new Date()
        })

      // NOTE: If user is live now:
      if (data.user.stream) {
        log('checking recent events because the current user is live on Twitch')

        const [isBroadcastCaptured] = await database.knex('events')
          .select('*')
          .where({
            action: actions.BROADCAST_START,
            from: username,
            ref: data.user.stream.id
          })
          .limit(1)

        let action = actions.BROADCAST_START
        let createdAt = new Date(data.user.stream.createdAt)

        if (isBroadcastCaptured) {
          log('updating history of this broadcast because the currernt broadcast is being captured')

          action = actions.BROADCAST_UPDATE
          createdAt = new Date()
        } else {
          log('creating new broadcast history to the database because there is no history about current broadcast')
        }

        // NOTE: Update current status to the database:
        await database.knex('events')
          .insert({
            action,
            createdAt,
            from: username,
            ref: data.user.stream.id
          })
        // NOTE: Update current statistics to the database:
        await database.knex('streams')
          .insert({
            username,
            userId: data.user.id,
            streamId: data.user.stream.id,
            title: data.user.stream.title,
            type: data.user.stream.type,
            game: data.user.stream.game.name,
            averageFps: data.user.stream.averageFPS,
            bitrate: data.user.stream.bitrate,
            broadcasterSoftware: data.user.stream.broadcasterSoftware,
            codec: data.user.stream.codec,
            height: data.user.stream.height,
            width: data.user.stream.width,
            clipCount: data.user.stream.clipCount,
            viewersCount: data.user.stream.viewersCount,
            isPartner: data.user.stream.isPartner,
            updatedAt: new Date()
          })
      } else {
        const [recentBroadcastEvent] = await database.knex('events')
          .select('*')
          .where({
            action: actions.NAMESPACE_BROADCAST + '%',
            from: username
          })
          .limit(1)

        // NOTE: Check the latest broadcast event to terminate if termination event('BROADCAST_END') was not recorded.
        if (recentBroadcastEvent && recentBroadcastEvent.action !== actions.BROADCAST_END) {
          log('terminating the last broadcast which was not recorded as ended')

          await database.knex('events')
            .insert({
              action: actions.BROADCAST_END,
              from: username,
              ref: recentBroadcastEvent.ref
            })
        }
      }
    }
  }
}
