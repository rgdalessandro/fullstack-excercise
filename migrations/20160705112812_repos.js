
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('repos', function(table){
      table.integer('id').primary();
      table.string('repo_name');
      table.string('owner_name');
      table.integer('stargazers');
    }),

    knex.schema.createTable('contributors', function(table){
      table.integer('id').primary();
      table.string('contributor_name');
    }),

    knex.schema.createTable('contributions', function(table){
      table.integer('repo_id').unsigned().references('id').inTable('repos');
      table.integer('contributor_id').unsigned().references('id').inTable('contributors');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('repos'),
      knex.schema.dropTable('contributors'),
      knex.schema.dropTable('contributions')      
    ])
};
