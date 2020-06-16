module.exports = {
  database: {
    client: 'sqlite3',
    connection: {
      filename: './.data/main.db'
    }
  },
  arc: {
    intervals: {
      token: 1000 * 10 * 60,
      status: 1000 * 30
    },
    users: []
  }
}
