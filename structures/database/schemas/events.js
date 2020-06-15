module.exports = async knex => {
  await knex.schema.createTable('events', table => {
    table.increments('id')
    table.string('action', 32)
    table.string('from', 256)
    table.string('ref', 2048)
    table.datetime('createdAt')

    return table
  })
}
