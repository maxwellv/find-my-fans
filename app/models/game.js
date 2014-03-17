'use strict';

module.exports = Game;
var games = global.nss.db.collection('games');
//var Mongo = require('mongodb');
var _ = require('lodash');
//var fs = require('fs');
//var path = require('path');


function Game(game){
  this._id = game._id;
  this.teams = game.teams || [];
  this.city = game.city;
  this.dateTime = game.dateTime;
  this.sportName = game.sportName;
  this.apiId = game.apiId || ''; //for stubHub, seatGeek, etc.
}

Game.prototype.insert = function(fn){
  var self = this;
  games.insert(self, function(err, records){
    fn(err, records);
  });
};

Game.destroy = function(_id, fn){

  games.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Game.prototype.update = function(fn){
  var self = this;
  games.update({_id: self._id}, self, function(err, result){
    fn(result);
  });
};

Game.findById = function(_id, fn){

  games.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Game.findAll = function(fn){
  games.find().toArray(function(err, records){
    fn(records);
  });
};

Game.findBySportName = function(sportName, fn){
  games.find({sportName:sportName}).toArray(function(err, records){
    fn(records);
  });
};

Game.findByCity = function(city, fn){
  games.find({city:city}).toArray(function(err, records){
    fn(records);
  });
};

Game.findByTeam = function(team, fn){
  games.find().toArray(function(err, records){
    var results = [];
    _.each(records, function(record){
      _.each(record.teams, function(oneTeam){
        if(oneTeam === team){
          results.push(record);
        }
      });
    });
    fn(results);
  });
};

