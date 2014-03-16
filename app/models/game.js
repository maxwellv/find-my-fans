'use strict';

module.exports = Game;
var games = global.nss.db.collection('games');
//var espnKey = process.env.ESPNKEY;
//var $ = require('../static/js/vendor/jquery');
//var Mongo = require('mongodb');
//var _ = require('lodash');
//var fs = require('fs');
//var path = require('path');


function Game(game){
  this._id = game._id;
  this.teams = game.teams || [];
  this.city = game.city;
  this.dateTime = game.dateTime;
  this.apiId = game.apiId;
}


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

