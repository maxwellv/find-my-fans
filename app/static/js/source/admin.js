(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    //$(document).foundation();
    $('#getTeams').click(getTeams);
    $('#getNews').click(getNews);
    $('#getGames').click(pullTeams);
    $('#sportNews').change(pullDbTeams);
    $('#teamNews').change(pullDbGames);
    $('#sportGames').change(pullGameTeams);
    //$('#teamGames').change(pullDbGames);
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
  function pullGameTeams(){
    var sport = $('#sportGames').val();
    var url = '/teams/'+sport;
    $.getJSON(url, appendGameTeams);
  }

  function appendGameTeams(data){
    $('#teamGames').empty();
    var teams = data.teams;
    for(var i=0; i<teams.length; i++){
      var teamData = teams[i];
      var $team = $('<option>');
      $team.text(teamData.name);
      //$team.attr('data-id, teamData._id');
      $team.val(teamData._id);
      $('#teamGames').append($team);
    }
  }

  function getGames(){
    //'http://api.seatgeek.com/2/events?performers.slug=memphis-grizzlies';
    console.log('GET GAMES CALLED');
    var which = $('#teamGames').val();
    var url = '/team/'+which;
    $.getJSON(url, receiveTeam);
  }

  function receiveTeam(team){
    console.log('receiveGames: ', team);
    var teamName = (team.city + '-' +team.name).replace('.', '').replace(' ', '-').toLowerCase();
    var url = 'http://api.seatgeek.com/2/events?performers.slug=' + teamName;
    console.log('url: ', url);
    $.getJSON(url, formatGames);
  }

  function formatGames(req){
    //only time req is used
    var games = req.events;
    var gameData = [];
    for(var i=0; i<games.length; i++){
      var data = games[i];
      var object = {};
      object.teams = [];     //WATCH FOR BUGS LATER!
      var tempTeams = [data.performers[0].short_name, data.performers[1].short_name];
      console.log('tempTeams: ', tempTeams);
      for(var x=0; x<tempTeams.length; x++){
        getTeamAgain(tempTeams[x], function(teamData){
          object.teams.push(teamData._id);
        });
      }
      object._id = data.id;
      object.title = data.title;
      object.shortTitle = data.short_title;
      object.sportName = data.taxonomies[1].name;
      object.city = data.venue.city;
      object.ticketURL  = data.url;
      object.locationData = data.location;
      gameData.push(object);
    }
    console.log('formatGames: ', gameData);
    gamesGot(gameData);
  }

  function getTeamAgain(which, fn){
    var url = '/teamName/'+which;
    $.getJSON(url, function(data){
      fn(data);
    });
  }

  function gamesGot(data){
    var url = '/games/populate';
    var type = 'POST';
    var success = gamesSent;
    $.ajax({url:url, type:type, success:success, data:data});
    console.log('games got called: ', data);
    console.log('gamesGot: ', data);
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

