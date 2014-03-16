/*jshint loopfunc: true */
'use strict';

module.exports = Meetup;
var meetups = global.nss.db.collection('meetups');
//var espnKey = process.env.ESPNKEY;
//var $ = require('../static/js/vendor/jquery');
var Mongo = require('mongodb');
//var _ = require('lodash');
//var fs = require('fs');
//var path = require('path');

function Meetup(meetup){
  this._id = meetup._id;
  this.gameId = meetup.gameId;
  this.userId = meetup.userId ? new Mongo.ObjectID(meetup.userId.toString()) : meetup.userId;
}

Meetup.destroy = function(_id, fn){
  //var _id = Mongo.ObjectID(id);

  meetups.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Meetup.prototype.update = function(fn){
  meetups.update({_id: this._id}, this, function(err, result){
    fn(result);
  });
};

Meetup.findById = function(_id, fn){
  //var _id = Mongo.ObjectID(id);

  meetups.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Meetup.findAll = function(fn){
  meetups.find().toArray(function(err, records){
    fn(records);
  });
};

