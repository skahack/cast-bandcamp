var debug = require('debug')('bandcamp::sender');
var React = require('react');
var Player = require('./components/player');
var TrackStatus = require('./components/track-status');
var Cast = require('./utils/cast');

window.__onGCastApiAvailable = function(loaded, errorInfo) {
  if (loaded) {
    Cast.init();
  } else {
    debug(errorInfo);
  }
};

var el = document.createElement('div');
el.className = "inline_player chromecast";
$('.inline_player.desktop-view').before(el);

React.render(<Player />, el);

$('#track_table .track_row_view').each(function(){
  var trackNum = parseInt($(this).attr('rel').replace(/tracknum=/, '')) - 1;

  var el = document.createElement('td');
  el.className = "cast-play-col";
  React.render(<TrackStatus trackNum={trackNum} />, el);

  var $el = $(el);
  $el.hide();

  $(this).prepend($el);
});
