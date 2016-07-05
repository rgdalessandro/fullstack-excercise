
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('repos', function(table){
      table.integer('id').primary();
      table.string('repo_name');
      table.string('owner_name');
      table.integer('stargazers');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('repos')
    ])
};
