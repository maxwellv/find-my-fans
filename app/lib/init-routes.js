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

  app.get('/', d, home.index);
  app.get('/auth', d, users.auth);
  app.post('/auth', d, users.create);
  app.post('/login', d, users.login);
  app.post('/logout', d, users.logout);
  app.get('/teams', d, teams.index);
  app.get('/teams/:sportName', d, teams.showBySport);
  app.post('/teams', d, teams.insert);
  app.get('/admin/get-teams', d, teams.getTeams);
  app.post('/teams/populate', d, teams.populate);
  console.log('Routes Loaded');
  fn();
}


