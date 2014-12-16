var debug = require('debug')('bandcamp::sender');
var React = require('react');
var Cast = require('./utils/cast');
var Player = require('./components/player');
var TrackStatus = require('./components/track-status');

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

var style = [
  'position: absolute;',
  'width: 36px;',
  'top: 16px;',
  'left: 342px;',
  'cursor: pointer;',
  'background: #fff;',
  'z-index: 999;'
];
var $el = $('<div style="position:relative"><img class="cast-bandcamp" style="'+style.join('')+'"></div>');
$('#name-section').append($el);

