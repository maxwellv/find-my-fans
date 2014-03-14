'use strict';

process.env.DBNAME = 'findMyFans-test';
var expect = require('chai');
var Mongo = require('mongodb');
var Team;
var teams;

describe('Team', function(){
  
  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Team = require('../../app/models/team');
      teams = global.nss.db.collection('teams');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      done();
    });
  });

  describe('New', function(){
    it('should create a new Team object', function(done){
      var team = new Team({_id:'s:70~l:90~t:1', city: 'Boston', name: 'Bruins', sportname: 'hockey', leagueName:'National Hockey League', leagueShortName: 'NHL', color:'000000'};
      expect(team).to.be.instanceof(Team);
      expect(team.name).to.equal('Bruins');
      expect(team.city).to.equal('Boston');
      expect(team._id).to.equal('s:70~l:90~t:1');
      expect(team.sportname).to.equal('hockey');
      expect(team.leagueName).to.equal('National Hockey League');
      expect(team.leagueShortName).to.equal('NHL');
    });
  });

});
