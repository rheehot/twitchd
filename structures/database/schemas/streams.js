module.exports = async knex => {
  await knex.schema.createTable('streams', table => {
    table.increments('id')
    table.string('username', 32)
    table.string('streamId', 32)
    table.string('title', 256)
    table.string('type', 16)
    table.string('game', 128)
    table.integer('viewersCount', 11)
    table.datetime('updatedAt')

    return table
  })
}
