(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#showM').click(showMeetupPanel);
    $('#close').click(closeMeetupPanel);
    $('#sport').change(pickSport);
    $('#team').change(pickTeam);
//    $('#upcomingGames').change(pickGame);
  }

  function showMeetupPanel(){
    $('#createMeetup').animate({margin:'+0 +0 +0 +550'},1000);
  }

  function closeMeetupPanel(){
    $('#createMeetup').animate({margin:'+0 +0 +0 +0'},1000);
  }

  function pickSport(){
    alert('hey');
    var sport = $('#sport').val();
    var url = '/teams/' + sport;
    $.getJSON(url, appendTeams);
    console.log('getJSON url:' + url );
  }

  function appendTeams(data){
    $('#team').empty();
    var teams = data.teams;
    for(var i=0; i<teams.length; i++){
      var teamData = teams[i];
      var $team = $('<option>');
      $team.text(teamData.name);
      $team.val(teamData._id);
      $('#team').val($team);
      $('#team').append($team);
    }
  }

})();

