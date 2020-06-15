const schemas = require('./schemas')
const knex = require('./knex')

const createTables = async () => {
  const tableNames = Object.keys(schemas)

  for (let i = 0, l = tableNames.length; i < l; i++) {
    const tableName = tableNames[i]

    if (!await knex.schema.hasTable(tableName)) {
      await schemas[tableName](knex)
    }
  }
}

module.exports = createTables
