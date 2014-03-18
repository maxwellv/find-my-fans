(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#showM').click(showMeetupPanel);
    $('#close').click(closeMeetupPanel);
//    $('#sport').change(pickSport);
//    $('#team').change(pickTeam);
//    $('#upcomingGames').change(pickGame);
  }

  function showMeetupPanel(){
    $('#createMeetup').animate({margin:'+0 +0 +0 +550'},1000);
  }

  function closeMeetupPanel(){
    $('#createMeetup').animate({margin:'+0 +0 +0 +0'},1000);
  }
/*


  function showMeetupPanel(){
    $('#createMeetup').animate({margin:'+0 +0 +0 +420'},1000);
  }
  function pickSport(){
    var sport = $('#sport').val();
    var url = '/teams/' + sport;
    $.getJSON(url, appendTeams);
  }
  function appendTeams(){
    $('#team' 
}
*/

})();

