'use strict';

module.exports = Team;
var teams = global.nss.db.collection('teams');
var Mongo = require('mongodb');
//var _ = require('lodash');
//var fs = require('fs');
//var path = require('path');


// if applicable, team._id = ESPN teamData.uid
// watch for bugs with this.schedule: empty arrays can be dangerous!
function Team(team){
  this._id = team._id;
  this.name = team.name;
  this.sportName = team.sportName;
  this.leagueName = team.leagueName;
  this.leagueShortName = team.leagueShortName;
  this.city = team.city;
  this.color = team.color;
  this.schedule = team.schedule || [];
}

Team.prototype.insert = function(fn){
  var self = this;
  teams.insert(self, function(err, records){
    fn(err, records);
  });
};

Team.destroy = function(_id, fn){
  //var _id = Mongo.ObjectID(id);

  teams.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Team.prototype.update = function(fn){
  var self = this;
  teams.update({_id: self._id}, self, function(err, result){
    fn(result);
  });
};

Team.findById = function(_id, fn){
  //var _id = Mongo.ObjectID(id);

  teams.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Team.findAll = function(fn){
  teams.find().toArray(function(err, records){
    fn(records);
  });
};

