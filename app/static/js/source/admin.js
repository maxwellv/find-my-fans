(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    //$(document).foundation();
    $('#getTeams').click(getTeams);
    $('#getNews').click(getNews);
    $('#getGames').click(pullTeams);
    $('#sportNews').change(pullDbTeams);
    //$('#teamNews').change(pullDbGames);
  }

  ///////GET TEAMS///////
  function getTeams(){
    var sport = $('#sportTeam').val().toLowerCase();
    var url = 'http://api.espn.com/v1/sports'+sport+'/teams/?apikey=cg47xhrsmt7feuzhf5b3dsjv';
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

  ///////GET NEWS///////

  //sending teams, not news!!! FIX
  //MUST REGEX FOR t value
  //ex: 's:70~l:90~t:27' becomes 27
  function getNews(){
    var teamId = $('#teamNews').val();
    console.log('getNews: '+teamId);
    var url = 'http://api.espn.com/v1/sports/hockey/nhl/teams/'+teamId+'/news?apikey=cg47xhrsmt7feuzhf5b3dsjv';
    $.getJSON(url, receiveNews);
  }

  function receiveNews(data){
    console.log(data);
  }

  function pullDbTeams(){
    var sport = $('#sportNews').val();
    var url = '/teams/'+sport;
    $.getJSON(url, appendTeams);
  }

  function appendTeams(data){
    $('#teamNews').empty();
    var teams = data.teams;
    for(var i=0; i<teams.length; i++){
      var teamData = teams[i];
      var $team = $('<option>');
      $team.text(teamData.name);
      $team.value = teamData._id;
      $('#teamNews').append($team);
    }
  }

  function pullDbGames(){
    var team = $('#teamNews').val();
    console.log(team);
    var url = '/games/:teamId';
    $.getJSON(url, appendGames);
  }

  function appendGames(data){
    var games = data.games;
    for(var i=0; i<games.length; i++){
      var gameData = games[i];
      var $game = $('<option>');
      var text = gameData.dateTime+'-'+gameData.title;
      $game.text(text);
      $game.value = gameData._id;
      $('#gameNews').append($game);
    }
  }



  ///////GET GAMES///////
  function getGames(data){
    //'http://api.seatgeek.com/2/events?performers.slug=memphis-grizzlies';
    console.log('GET GAMES CALLED');
    var allTeams = data.teams;
    var teamNames = [];
    _.each(allTeams, function(team){
      var teamName = (team.city + '-' +team.name).replace('.', '').replace(' ', '-').toLowerCase();
      teamNames.push(teamName);
    });
    _.each(teamNames, function(teamName){
      var url = 'http://api.seatgeek.com/2/events?performers.slug=' + teamName;
      $.getJSON(url, gamesGot);
    });
  }

  function gamesGot(data){
    var url = '/games/populate';
    var type = 'POST';
    var success = gamesSent;
    $.ajax({url:url, type:type, success:success, data:data});
    console.log('games got called: ', data);
  }

  function gamesSent(data){
    console.log('gamesSent called: ', data);
  }

  function pullTeams(){
    var sport = 'hockey';
    var url = '/teams/'+sport;
    $.getJSON(url, getGames);
  }



})();

