/*jshint loopfunc:true, camelcase:false */
// JADE DOCUMENTS MUST CALL SCRIPTS:
// - news.js | lodash.js | jquery.js -
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    //$('#getNews').click(getNews);
    getTeams();
  }

  var uid = $('#uid').text();

  ///////GET NEWS///////

  function getTeams(){
    var url = '/teams/user/'+uid;
    $.getJSON(url, receiveTeams);
  }

  function receiveTeams(data){
    console.log(data);
  }

})();

