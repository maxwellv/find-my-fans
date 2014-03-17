'use strict';

var http = require('http');

module.exports = function(){

  console.log('-----------------GET GAMES-----------------------');
  //var options = {
    //host: url,
    //path: 'http://api.seatgeek.com/2/events?performers.slug=memphis-grizzlies',
    //method: 'GET'
  //};

  var url = 'http://api.seatgeek.com/2/events?performers.slug=memphis-grizzlies';
  http.get(url, function(data, res){
    console.log(data);
    res.send(data);
  });
};
