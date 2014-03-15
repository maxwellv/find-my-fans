'use strict';

var Team = require('../models/team');
/*
exports.index = function(req, res){
  Team.findByUser(req.session.userId, function(teams){
    res.render('home/index', {title:'find-by-fans', teams:teams});
  });
};
*/
exports.showBySport = function(req, res){
  Team.findBySportName(req.params.sportName, function(teams){
    res.render('home/index', {title: 'teams by sport', teams:teams});
    res.send({teams:teams});
  });
};

exports.getTeams = function(req, res){
  res.render('admin/get-teams');
};

exports.insert = function(req, res){
  res.send({dataTest:req.body});
};

exports.populate = function(req, res){
  var sportName = req.body.sports[0].name;
  var leagueShortName = req.body.sports[0].leagues[0].shortName;
  var leagueName = req.body.sports[0].leagues[0].name;
  var teams = req.body.sports[0].leagues[0].teams;
  var teamData = [];
  var dbData = [];
  for(var i=0; i<teams.length; i++){
    var data = teams[i];
    var object = {};
    object._id = data.uid;
    object.name = data.name;
    object.sportName = sportName;
    object.leagueShortName = leagueShortName;
    object.leagueName = leagueName;
    object.city = data.location;
    object.color = data.color;
    object.schedule = [];     //WATCH FOR BUGS LATER!
    teamData.push(object);
  }
  //Team.autoCreate(teamData, function(records){
  //  dbData.push(records);
  //});
  res.send({teamData:teamData, dbData:dbData});
};
