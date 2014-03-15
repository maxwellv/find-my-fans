(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    //$(document).foundation();
    getTeams();
  }

  function getTeams(){
    var urlNhl = 'http://api.espn.com/v1/sports/hockey/nhl/teams/?apikey=cg47xhrsmt7feuzhf5b3dsjv';
    //var urlMlb;
    //var urlNfl;
    console.log('getTeams called. urlNhl');
    $.getJSON(urlNhl, sendTeams);
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

