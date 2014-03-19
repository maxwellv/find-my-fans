'use strict';

process.env.DBNAME = 'meetup-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var User, Meetup;
var sue, sueId, meetup;
var cookie;

describe('users', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Meetup = require('../../app/models/meetup');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      sue = new User({name:'sue', email:'sue@aol.com', password:'abcd'});
      meetup = new Meetup({sportName: 'Hockey', city:'Nashville', loyalty:'Predators', teams:['s:70~l:90~t:27', 's:70~l:90~t:5']});
      sue.register(function(){
        meetup.insert(function(){
          User.findByName('sue', function(foundUser){
            sueId = foundUser._id;
            done();
          });
        });
      });
    });
  });
  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .field('email', 'sue@aol.com')
      .field('password', 'abcd')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });
    describe('POST /meetups', function(){
      it('should create an meetup in the database', function(done){
        request(app)
        .post('/meetups')
        .set('cookie', cookie)
        .send({sportName: 'Hockey',
          city: 'Nashville',
          loyalty: 's:70~l:90~t:27',
          teams:['s:70~l:90~t:27', 's:70~l:90~t:5'],
          attendees:[sueId]})
        .end(function(err, res){
          expect(res.status).to.equal(302);
          done();
        });
      });
    });
    describe('GET /meetups:id', function(){
      it('should return the specified meetup', function(done){
        request(app)
        .get('/meetups/'+meetup._id)
        .set('cookie', cookie)
        .end(function(err, res){
          console.log('GET MEETUP', meetup);
          console.log('res.body', res.body);
          done();
        });
      });
    });

    


  //end of auth
  });

//end of document
});


