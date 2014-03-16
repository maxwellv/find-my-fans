(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    //$(document).foundation();
    getAllTeams();
  }

  function getAllTeams(){
    getTeams('hockey');
    getTeams('football');
    getTeams('basketball');
    getTeams('baseball');
  }

  function getTeams(sport){

    sport = sport.toLowerCase();
    var url;
    switch(sport){
      case 'hockey':
        url = 'http://api.espn.com/v1/sports/hockey/nhl/teams/?apikey=cg47xhrsmt7feuzhf5b3dsjv';
        break;
      case 'football':
        url = 'http://api.espn.com/v1/sports/football/nfl/teams/?apikey=cg47xhrsmt7feuzhf5b3dsjv';
        break;
      case 'basketball':
        url = 'http://api.espn.com/v1/sports/basketball/nba/teams/?apikey=cg47xhrsmt7feuzhf5b3dsjv';
        break;
      case 'baseball':
        url = 'http://api.espn.com/v1/sports/baseball/mlb/teams/?apikey=cg47xhrsmt7feuzhf5b3dsjv';
        break;
    }
    console.log('getTeams called: '+sport);
    $.getJSON(url, sendTeams);
  }

  function sendTeams(data){
    console.log('sendTeams called: ', data);
    var url = '/teams/populate';
    var type = 'POST';
    var success = teamsSent;
    
    $.ajax({url:url, type:type, success:success, data:data});
  }

  function teamsSent(data){
    console.log('teamsSent called :', data);
  }


})();

