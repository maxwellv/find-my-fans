/* jshint expr:true */
'use strict';

process.env.DBNAME = 'team2-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
//var exec = require('child_process').exec;
var User, Team;
var sue;
var cookie;

describe('teams', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Team = require('../../app/models/team');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      sue = new User({email:'sue@nomail.com', password:'abcd', teams:[]});
      sue.register(function(err){
        done();
      });
    });
  });

  /*
  describe('GET /teams', function(){
    it('should get not teams because not logged in', function(done){
      request(app)
      .get('/teams/user/'+sue._id)
      .expect(302, done);
      console.log(res.body);
    });
  });
*/

  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .field('email', 'sue@nomail.com')
      .field('password', 'abcd')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('GET /teams/:sportName', function(){
      it('should get teams by sport', function(done){
        //console.log('GET BY SPORT NAME!!!!');
        request(app)
        .get('/teams/football')
        .set('cookie', cookie)
        //.expect(200);
        .end(function(err, res){
          //console.log(err);
          done();
        });
        //done();
      });
    });

    describe('GET /teams/user/:id', function(){
      it('should get teams by user', function(done){
        var t1 = new Team({name:'Titans',
                           city:'Nashville',
                           color:'Blue'});
        t1.insert(function(){
          sue.teams = [t1._id];
          sue.update(function(){
            console.log('GET BY USER!!!!');
            request(app)
            .get('/teams/user/'+sue._id)
            .set('cookie', cookie)
            .end(function(err, res){
              console.log(res.body);
              done();
            });
          });
        });
      });
    });

    /*
    describe('POST /teams', function(){
      it('should insert a new team object in the db', function(done){
        var t1 = new Team({name:'Titans',
                           city:'Nashville',
                           color:'Blue'});
        request(app)
        .post('/teams')
        .send(t1)
        .set('cookie', cookie)
        .end(function(err, res){
          console.log(res.body);
          expect(404);
          done();
        });
        //.expect(404, done);
      });
    });
*/
  //end of auth
  });

//end of document
});
