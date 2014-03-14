'use strict';

var espnKey = process.env.ESPNKEY;

exports.allTeams = function(fn){
  var url = 'http://api.espn.com/v1/sports/?apikey=' + espnKey;

  $.getJSON(url, function(data){
    console.log('GET JSON CALLBACK: ', data);
    fn(data);
  });
};
