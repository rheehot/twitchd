module.exports = async knex => {
  await knex.schema.createTable('users', table => {
    table.increments('id')
    table.string('username', 32)
    table.string('displayName', 64)
    table.string('description', 2048)
    table.datetime('createdAt')
    table.boolean('isPartner')

    return table
  })
}
