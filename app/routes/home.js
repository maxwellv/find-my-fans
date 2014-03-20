/*jshint loopfunc:true, camelcase:false */
'use strict';
var Team = require('../models/team');
var User = require('../models/user');
var Game = require('../models/game');
var Meetup = require('../models/meetup');
var _ = require('lodash');


exports.index = function(req, res){
  //console.log('req.session.userId', req.session.userId);
  var userId = req.session.userId;
  var teams = [];
  var gamesTotal = [];
  var games = [];
  //var meetups = [];

  if(userId !== undefined){
    User.findById(userId, function(user){

      if(user.teams.length === 0){
        user.teams = [{leagueShortName:'none', name:'none', color:'none', city:'none'}];

      }else{
        for(var i=0; i<user.teams.length; i++){
          Team.findById(user.teams[i], function(team){
            teams.push(team);
            Game.findByTeam(team.sportName, team.longName, function(gamesFound){
              gamesTotal.push(gamesFound);
            });
          });
        }
      }

      Meetup.findByUser(userId, function(meetups){
        games = _.flatten(gamesTotal);
        res.render('home/index', {title: 'Welcome Fan!', userId:userId, teams:teams, meetups:meetups, games:games});
        //res.send({userId:userId, teams:teams, meetups:meetups, games:games});
      });
    });

  }else{
    res.render('home/index', {title: 'Welcome Fan!'});
  }

};

