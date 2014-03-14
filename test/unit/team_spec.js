/* jshint expr:true */
'use strict';

process.env.DBNAME = 'findMyFans-test';
var expect = require('chai').expect;
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
    it('should create a new Team object', function(){
      var obj = {_id:'s:70~l:90~t:1', city: 'Boston', name: 'Bruins', sportName: 'hockey', leagueName:'National Hockey League', leagueShortName: 'NHL', color:'000000'};
      var team = new Team(obj);
      expect(team).to.be.instanceof(Team);
      expect(team.name).to.equal('Bruins');
      expect(team.city).to.equal('Boston');
      expect(team._id).to.equal('s:70~l:90~t:1');
      expect(team.sportName).to.equal('hockey');
      expect(team.leagueName).to.equal('National Hockey League');
      expect(team.leagueShortName).to.equal('NHL');
    });
  });

  describe('#insert', function(){
    it('should add team to the database', function(done){
      var obj = {_id:'s:70~l:90~t:1', city: 'Boston', name: 'Bruins', sportName: 'hockey', leagueName:'National Hockey League', leagueShortName: 'NHL', color:'000000'};
      var team = new Team(obj);
      team.insert(function(){
        expect(team._id).to.equal(obj._id);
        done();
      });
    });
  });

  describe('#destroy', function(){
    it('should remove a team from the database', function(done){
      var obj = {_id:'s:70~l:90~t:1', city: 'Boston', name: 'Bruins', sportName: 'hockey', leagueName:'National Hockey League', leagueShortName: 'NHL', color:'000000'};
      var team = new Team(obj);
      team.insert(function(){
        var teamId = obj._id;
        Team.destroy(teamId, function(count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });

  describe('#update', function(){
      it('should update the team in the database', function(done){
        var obj = {_id:'s:70~l:90~t:1', city: 'Nash', name: 'Bruins', sportName: 'hockey', leagueName:'National Hockey League', leagueShortName: 'NHL', color:'000000'};
        var team = new Team(obj);
        team.insert(function(){
          team.city = 'Boston';
          team.update(function(result){
            teams.findOne({_id: obj._id}, function(err, record){
              expect(record.city).to.equal('Boston');
              done();
            });
          });
        });
      });
    });

  describe('#findById', function(){
    it('should find an team by its id', function(done){
      var obj = {_id:'s:70~l:90~t:1', city: 'Nash', name: 'Bruins', sportName: 'hockey', leagueName:'National Hockey League', leagueShortName: 'NHL', color:'000000'};
      var team = new Team(obj);
      team.insert(function(){
        var teamID = (team._id);
        Team.findById(teamID, function(team){
          expect(team._id).to.deep.equal(teamID);
          done();
        });
      });
    });
  });

  describe('findAll', function(){
    it('should find all items', function(done){
      var obj = {_id:'s:70~l:90~t:1', city: 'Nash', name: 'Bruins', sportName: 'hockey', leagueName:'National Hockey League', leagueShortName: 'NHL', color:'000000'};
      var team = new Team(obj);
      team.insert(function(){
        Team.findAll(function(records){
          expect(records.length).to.equal(1);
          done();
        });
      });
    });
  });


//End of Document
});
