module.exports = async knex => {
  await knex.schema.createTable('streams', table => {
    table.increments('id')
    table.string('username', 32)
    table.string('userId', 32)
    table.string('streamId', 32)
    table.string('title', 256)
    table.string('type', 16)
    table.string('game', 128)
    table.float('averageFps')
    table.float('bitrate')
    table.string('broadcasterSoftware', 128)
    table.string('codec', 64)
    table.integer('height', 11)
    table.integer('width', 11)
    table.integer('clipCount', 11)
    table.integer('viewersCount', 11)
    table.boolean('isPartner')
    table.datetime('updatedAt')

    return table
  })
}
