
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('repos', function(table){
      table.string('repo-name');
      table.string('owner-name');
      table.integer('stargazers');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('repos')
    ])
};
