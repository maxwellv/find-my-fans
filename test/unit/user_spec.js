/* jshint expr:true */

'use strict';

process.env.DBNAME = 'barter-town';
var expect = require('chai').expect;
var User;
var fs = require('fs');
var exec = require('child_process').exec;
var Mongo = require('mongodb');
var u1, u2;

describe('User', function(){
  this.timeout(5000); //email testing takes a while to execute, so I'm giving all tests five seconds to run

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/samaolcom/prof*';
    var cmd = 'rm ' + testdir;
    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/testpic.jpg';
      var copyfile = __dirname + '/../fixtures/testpic-copy.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      global.nss.db.dropDatabase(function(err, result){
        u1 = new User({name: 'Sue', email:'max.vance+FINDMYFANS_UNIT_TEST_BEFOREEACH@gmail.com', password:'678utf', photo:'img.gif', description:'my name is sue', teams:['Nashville Predators'], home:'Nashville, TN'});
        u1.register(function(err, body){
          done();
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      u1 = new User({name: 'Sam', email:'sam@aol.com', password:'1234', photo:'img/photo.jpg', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      expect(u1).to.be.instanceof(User);
      expect(u1.name).to.equal('Sam');
      expect(u1.email).to.equal('sam@aol.com');
      expect(u1.password).to.equal('1234');
      expect(u1.teams).to.have.length(1);
      expect(u1.teams[0]).to.equal('Nashville Predators');
    });
  });

  describe('register', function(){
    it('should register a new user and put it in the DB', function(done){
      u1 = new User({name:'Max', email: 'max.vance+FINDMYFANS_UNIT_TEST_REGISTER@gmail.com', password:'1234', photo:'img/photo.jpg', description:'my name is max', teams:['Nashville Predators'], home:'Nashville, TN'});
      u1.register(function(err, body){
        expect(err).to.equal(null);
        expect(u1.password).to.not.equal('1234');
        expect(u1.password).to.have.length(60); //this checks for a hashed password
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        body = JSON.parse(body);
        expect(typeof body.id).to.equal('string');
        done();
      });
    });

    it('should not register a duplicate user based on email', function(done){
      u1 = new User({name:'Not Max', email: 'max.vance+FINDMYFANS_UNIT_TEST_BEFOREEACH@gmail.com', password:'abcd', photo:'img/photo.jpg', description:'my name is not max', teams:['Tennessee Titans'], home:'Nashville, TN'});
      u1.register(function(err, body){
        expect(typeof err).to.equal('string');
        done();
      });
    });

    it('should not register a duplicate user based on name', function(done){
      u1 = new User({name:'Sue', email: 'max.vance+YOU_SHOULD_NOT_GET_THIS_EMAIL@gmail.com', password:'1234', photo:'img/photo.jpg', description:'my name is max', teams:['Nashville Predators'], home:'Nashville, TN'});
      u1.register(function(err, body){
        expect(typeof err).to.equal('string');
        done();
      });
    });
  });

  /* disabled these, the user.register function handles password hashing and dupe checking now
  describe('#hashPassword', function(){
    it('should hash the users password', function(done){
      u1 = new User({name: 'Sam', email:'sam@aol.com', password:'1234'});
      u1.hashPassword(function(){
        expect(u1.password).to.not.equal('1234');
        done();
      });
    });
  });

  describe('#save', function(){
    it('should insert a new user in the DB', function(done){
      u1 = new User({name: 'Sam', email:'sam@aol.com', password:'1234'});
      u1.hashPassword(function(){
        u1.save(function(ret){
          expect(ret._id.toString()).to.have.length(24);
          done();
        });
      });
    });
    it('should not insert a duplicate user because of email', function(done){
      u2 = new User({name: 'Sue', email:'sue@aol.com', password:'678utf', description:'my name is sue', teams:['Nashville Predators'], home:'Nashville, TN'});
      u2.save(function(ret){
        expect(u2._id).to.be.undefined;
        expect(ret).to.be.false;
        done();
      });
    });
    it('should not insert a duplicate user because of name', function(done){
      u2 = new User({name: 'Sue', email:'sue23@aol.com', password:'678utf', description:'my name is sue', teams:['Nashville Predators'], home:'Nashville, TN'});
      u2.save(function(ret){
        expect(u2._id).to.be.undefined;
        expect(ret).to.be.false;
        done();
      });
    });
  });
  */

  describe('.findById', function(){
    it('should find user by its id', function(done){
      u2 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_FINDBYID@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      u2.register(function(err, ret){
        User.findByEmail('max.vance+FINDMYFANS_UNIT_TEST_FINDBYID@gmail.com', function(ret){
          var testId = ret._id;
          User.findById(testId.toString(), function(ret1){
            expect(ret1.name).to.equal('Sam');
            done();
          });
        });
      });
    });
  });

  describe('.findByName', function(){
    it('should find a user by his name', function(done){
      u1 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_FINDBYNAME@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      u1.register(function(){
        User.findByName('Sam', function(ret){
          expect(ret.name).to.equal('Sam');
          expect(ret.email).to.equal('max.vance+FINDMYFANS_UNIT_TEST_FINDBYNAME@gmail.com');
          done();
        });
      });
    });
  });

  describe('findByEmailAndPassword', function(){
    it('should return a user by email and password', function(done){
      User.findByEmailAndPassword('max.vance+FINDMYFANS_UNIT_TEST_BEFOREEACH@gmail.com', '678utf', function(record){
        expect(record._id).to.deep.equal(u1._id);
        done();
      });
    });
    it('should not return a user unless email is registered', function(done){
      User.findByEmailAndPassword('bad@aol.com', '678utf', function(record){
        expect(record).to.be.false;
        done();
      });
    });
    it('should not return a user with wrong password', function(done){
      User.findByEmailAndPassword('max.vance+FINDMYFANS_UNIT_TEST_BEFOREEACH@gmail.com', '402fij', function(record){
        expect(record).to.be.false;
        done();
      });
    });
  });

  describe('findByEmail', function(){
    it('should return a user by email', function(done){
      u2 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_FINDBYEMAIL@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      u2.register(function(err, ret){
        User.findByEmail('max.vance+FINDMYFANS_UNIT_TEST_FINDBYEMAIL@gmail.com', function(record){
          //we can't run the following test based on ID since user.register doesn't return the registered user
          expect(record.name).to.equal('Sam');
          done();
        });
      });
    });
  });

  describe('#update', function(){
    beforeEach(function(done){
      u2 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_UPDATE@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      u2.register(function(){
        done();
      });
    });
    it('should update an existing user', function(done){
      User.findByEmail('max.vance+FINDMYFANS_UNIT_TEST_UPDATE@gmail.com', function(record){
        record = new User(record);
        record.email = 'max.vance+FINDMYFANS_UNIT_TEST_NEW_EMAIL@gmail.com';
        record.update(function(updatedUser){
          expect(updatedUser.email).to.equal('max.vance+FINDMYFANS_UNIT_TEST_NEW_EMAIL@gmail.com');
          expect(updatedUser._id).to.deep.equal(record._id);
          expect(updatedUser.password).to.have.length(60);
          done();
        });
      });
    });
  });

  describe('#addPhoto', function(){
    it('should add a photo to the user profile', function(done){
      u2 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_ADDPHOTO@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      var oldName = __dirname + '/../fixtures/testpic-copy.jpg';
      u2.addPhoto(oldName, function(){
        u2.register(function(err, record){
          User.findById(u2._id.toString(), function(record){
            expect(record.photo).to.deep.equal('/img/maxvance+findmyfans_unit_test_addphotogmailcom/profile.jpg');
            done();
          });
        });
      });
    });
  });

  describe('addTeam', function(){
    it('should add a team to the user\'s teams', function(done){
      u2 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_ADDTEAM@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      u2.register(function(){
        u2.addTeam('Tennessee Titans', function(){
          User.findById(u2._id.toString(), function(record){
            expect(record.teams).to.have.length(2);
            expect(record.teams[0]).to.equal('Nashville Predators');
            expect(record.teams[1]).to.equal('Tennessee Titans');
            done();
          });
        });
      });
    });
  });

  describe('removeTeam', function(){
    it('should remove a team from the user\'s teams', function(done){
      u2 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_REMOVETEAM@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      u2.register(function(){
        u2.removeTeam('Nashville Predators', function(){
          User.findById(u2._id.toString(), function(record){
            expect(record.teams).to.have.length(0);
            done();
          });
        });
      });
    });
  });

});

