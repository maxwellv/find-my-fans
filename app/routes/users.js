'use strict';

var User = require('../models/user');
//var sendEmail = require('../lib/send-email');

exports.auth = function(req, res){
  res.render('user/auth', {title:'User Authentication'});
};

exports.show = function(req, res){
  console.log('USER'+req.params.user);
  User.findByName(req.params.user, function(user){
    console.log(req.params.user);
    res.send({user:user});
  });
};

exports.create = function(req, res){
  var newUser = new User(req.body);
  newUser.register(function(){
    if (newUser._id){
      res.redirect('/');
    } else {
      res.render('user/auth', {title: 'Registeration error, try again'});
    }
  });
};

/*
exports.register = function(req, res){
  var used = new User(req.body);
  used.hashPassword(function(){
    console.log('after the used.hashPassword call');
    if(req.files.photo){
      used.addPhoto(req.files.photo.path, function(){
        used.save(function(ret){
          console.log('after the used.save call');
          if(ret._id){
            console.log('before the sendEmail call');
            sendEmail(req, res, {
              from: 'noreply@fakesite.com',
              to: ret.email,
              subject: 'You have registered for Find My Fans',
              text:'This is an email confirming your registration for Find My Fans. You have registered as ' + ret.name + '.'
            }, function(){
              res.redirect('/');
            });
          }else{
            res.render('user/auth');
          }
        });
      });
    }else{
      res.redirect('user/auth'); //can't create a user without a picture
    }
  });
};
*/

exports.login = function(req, res){
  User.findByEmailAndPassword(req.body.email, req.body.password, function(ret){
    if(ret._id){
      req.session.regenerate(function(){
        req.session.userId = ret._id.toString();
        req.session.save(function(){
          console.log('ooooooooooooooooooooo', req.session);
          res.redirect('/');
        });
      });
    }else{
      req.session.destroy(function(){
        res.send({success:false, error:'Email or password incorrect.'});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};
/*
exports.show = function(req, res){
  User.findById(req.params.id, function(user){
    res.render('users/show', {validUser:user});
  });
};
*/
