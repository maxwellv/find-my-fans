'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var users = require('../routes/users');
  var teams = require('../routes/teams');
  var games = require('../routes/games');

  app.get('/', d, home.index);
  app.get('/auth', d, users.auth);
  app.post('/auth', d, users.create);
  app.post('/login', d, users.login);
  app.post('/logout', d, users.logout);
  app.post('/teams/populate', d, teams.populate);
  app.get('/teams/user/:id', d, teams.index);
  app.get('/teams/:sportName', d, teams.showBySport);
  app.post('/teams', d, teams.insert);
  app.get('/games/user/:id', d, games.showByUser);
  app.get('/games/:sportName', d, games.showBySport);
  app.get('/admin/get-teams', d, teams.getTeams);
  console.log('Routes Loaded');
  fn();
}


