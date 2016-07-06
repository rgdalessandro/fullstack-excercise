var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
module.exports = app;

app.use( bodyParser.json() );


var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './github-fetcher.sqlite3'
  }
});


app.post('/repos/import', function (req, res) {
  var repos = req.body.repositories;
  var created = 0;
  var updated = 0;
  knex.select('id').table('repos')
  .then(function(rows){
    var existingRepos = rows;
    if (existingRepos.length > 0) existingRepos = existingRepos.map(row => row.id);
    for (repo of repos) {
      var id = repo.id;
      var repo_name = repo.repo_name;
      var owner_name = repo.owner_name;
      var stargazers = repo.stargazers;
      if (existingRepos.indexOf(id) < 0) {
        created++;
        knex('repos').insert({id: id, repo_name: repo_name, owner_name: owner_name, stargazers: stargazers})
        .then(function(resp){console.log("added repo", resp[0])});
      } else {
        updated++;
        knex('repos').where({id: id}).update({repo_name: repo_name, owner_name: owner_name, stargazers: stargazers})
        .then(function(resp){console.log("updated repo", resp)});
      }
    }
    res.status(202).send({created: created, updated: updated});
  });
});


app.post('/contributors/import', function (req, res) {
  var contributors = req.body.contributors;
  knex.select('id').table('contributors')
  .then(function(rows){
    var existingContributors = rows;
    if (existingContributors.length > 0) existingContributors = existingContributors.map(row => row.id);
    for (contributor of contributors) {
      var id = contributor.id;
      var contributor_name = contributor.contributor_name;
      if (existingContributors.indexOf(id) < 0) {
        knex('contributors').insert({id: id, contributor_name: contributor_name})
        .then(function(resp){console.log("added user", resp[0])});
      } else {
        
      }
    }
    res.sendStatus(202);
  });
});


app.post('/contributions/import', function (req, res) {
  var contributions = req.body;
  knex.select().table('contributions')
  .then(function(rows){
    var existingContributions = rows;
    if (existingContributions.length > 0) existingContributions = existingContributions.map(row => [row.repo_id, row.contributor_id]);
    for (contributor_id of contributions.contributor_ids) {
      var repo_id = contributions.repo_id;
      if (existingContributions.indexOf([repo_id, contributor_id]) < 0) {
        knex('contributions').insert({repo_id: repo_id, contributor_id: contributor_id})
        .then(function(resp){console.log("added contribution", resp)});
      } else {
        
      }
    }
    res.sendStatus(202);
  });
});


app.get('/repos', function (req, res) {
  knex('repos').orderBy('stargazers', 'desc').limit(25)
  .then(function(rows){
    res.json({repos: rows});
  });
});


app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'))
});

var port = process.env.PORT || 4040;
app.listen(port);
console.log("Listening on port " + port);
