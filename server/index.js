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
  res.sendStatus(202);
  var repos = req.body.repositories;
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
        knex('repos').insert({id: id, repo_name: repo_name, owner_name: owner_name, stargazers: stargazers})
        .then(function(resp){console.log(resp)});
      } else {
        knex('repos').where({id: id}).update({repo_name: repo_name, owner_name: owner_name, stargazers: stargazers})
        .then(function(resp){console.log(resp)});
      }
    }
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
