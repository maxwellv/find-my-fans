/*jshint loopfunc:true, camelcase:false */
'use strict';

var Meetup = require('../models/meetup');
var User = require('../models/user');
//var Team = require('../models/team');
var Game = require('../models/game');
var Mongo = require('mongodb');

exports.create = function(req, res){
  req.body.userId = (req.session.userId).toString();
  console.log('GOT TO MEETUPS.CREATE', req.body);
  var meetup  = new Meetup(req.body);
  meetup.userId = req.body.userId;
  meetup.insert(function(){
    User.findById(req.body.userId, function(theUser){
      var user = new User(theUser);
      user.update(function(err, result){
        res.redirect('/meetups/'+meetup._id);
        //res.send({meetup:meetup});
      });
    });
  });
};

exports.show = function(req, res){
  Meetup.findAll(function(meetups){
    res.render('meetups/show', {meetups:meetups});
  });
};

exports.createMeetup = function(req, res){
  //TODO: do some crap here
};

exports.showMeetup = function(req, res){
  User.findById((req.session.userId).toString(), function(user){
    Meetup.findById(Mongo.ObjectID(req.params.id), function(foundMeetup){
      Game.findById((foundMeetup.gameId).toString(), function(game){
        res.render('meetups/show-meetup', {meetup:foundMeetup, user:user, team1:foundMeetup.teams[0], team2:foundMeetup.teams[1], dateTime:game.dateTime});
        //res.send({meetup:foundMeetup});
        /*var team1, team2, loyalty;
        Team.findById(foundMeetup.teams[0], function(foundTeam){
          team1 = foundTeam;
          Team.findById(foundMeetup.teams[1], function(foundTeam){
            team2 = foundTeam;
            Team.findById(foundMeetup.loyalty, function(foundTeam){
              loyalty = foundTeam;
              res.send({meetup:foundMeetup, team1:team1, team2:team2, loyalty:loyalty});
              //res.render('meetups/show-meetup', {meetup:foundMeetup, team1:team1, team2:team2, loyalty:loyalty});
              //getAttendeeNames(foundMeetup.attendees, function(returnedAttendees){
                //console.log('GOT THESE ATTENDEES:', returnedAttendees);
                //returnedAttendees = returnedAttendees.join(', ');
                //res.render('meetups/show-meetup', {meetup:foundMeetup, team1:team1, team2:team2, loyalty:loyalty, attendees:returnedAttendees});
              //});
            });
          });
        });*/
      });
    });
  });
};

//not using attendees
/*
function getAttendeeNames(attendees, fn){
  var ret = [];
  if (!attendees){
    fn(['None']);
  } else {
    for (var x = 0;x < attendees.length;x++){
      var _id = attendees[x];
      User.findById(_id, function(foundUser){
        ret.push(foundUser.name);
        if (x === attendees.length){
          fn(ret);
        }
      });
    }
  }
}
*/
