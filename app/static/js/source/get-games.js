(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    //$(document).foundation();
    getGames();
  }

  function getGames(){
    var id = '53269ec8fcccd0c6248effc8';
    var url = '/games/user/' + id;

    $.getJSON(url, gamesGot);
  }

  function gamesGot(data){
    console.log('gamesGot called: ', data);
  }



})();

