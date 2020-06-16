module.exports = async knex => {
  await knex.schema.createTable('users', table => {
    table.increments('id')
    table.string('username', 32)
    table.string('userId', 32)
    table.string('displayName', 64)
    table.string('description', 2048)
    table.string('offlineImageURL', 2048)
    table.string('profileImageURL', 2048)
    table.integer('profileViewCount', 11)
    table.boolean('hasPrime')
    table.boolean('hasTurbo')
    table.boolean('isPartner')
    table.datetime('createdAt')
    table.datetime('updatedAt')

    return table
  })
}
