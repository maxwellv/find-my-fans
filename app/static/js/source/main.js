(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#showM').click(showMeetupPanel);
    $('#close').click(closeMeetupPanel);
    $('#sportGames').change(pickSport);
    $('#teamGames').change(pickTeam);
//    $('#upcomingGames').change(pickGame);
  }

  function showMeetupPanel(){
    $('#createMeetup').animate({margin:'+0 +0 +0 +550'},1000);
  }

  function closeMeetupPanel(){
    $('#createMeetup').animate({margin:'+0 +0 +0 +0'},1000);
  }

  function pickSport(){
    var sport = $('#sportGames').val();
    var url = '/teams/' + sport;
    $.getJSON(url, appendTeams);
  }

  function appendTeams(data){
    var teams = data.teams;
    var $teamSelect = $('#teamGames');

    _.each(teams, function(team){
      var $option = $('<option>');
      $option.val(team.longName);
      $option.text(team.longName);
      $option.attr('data-sport', team.sportName);
      $option.attr('data-id', team._id);
      $teamSelect.append($option);
    });
    console.log('appendTeams: ', teams);
  }

  function pickTeam(){
    var sport = $($('#teamGames > option:selected')).attr('data-sport');
    var team = $('#teamGames').val();
    var url = '/games/byteam/' + sport + '/' + team;
    $.getJSON(url, appendGames);
  }

  function appendGames(data){
    var games = data.games;
    var $gameSelect = $('#upcomingGames');

    _.each(games, function(game){
      var $option = $('<option>');
      $option.val(game.title);
      $option.text(game.shortTitle);
      $option.attr('data-id', game._id);
      $option.attr('data-sport', game.sportName);
      $gameSelect.append($option);

    });
    console.log('appendGames: ', data);
  }

})();

